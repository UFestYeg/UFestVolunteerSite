import React from "react";

// Shared CSS applied to an react-big-calendar event card's `myEvent` class so
// that, on hover, the card expands horizontally to reveal its full text while
// keeping its height roughly the same.
export const hoverExpandStyle = {
    "&:hover": {
        minWidth: "300px",
        width: "max-content !important",
        maxWidth: "min(500px, calc(100vw - 16px))",
        minHeight: "max-content !important",
        overflow: "visible !important",
        zIndex: 1000,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    },
    "&:hover .rbc-event-content": {
        flex: "0 0 auto !important",
        overflow: "visible",
        whiteSpace: "normal",
    },
} as const;

// Hook that, on hover, keeps an expanding event card at least as wide as its
// resting width (so cards never shrink on hover — they only ever grow wider)
// and nudges the card leftwards if its right edge would overflow the calendar's
// right edge — so the card grows to the left instead of running off the
// calendar. CSS handles the expansion; this only enforces the width floor and
// repositions, since CSS can't know the card's resting width or where it sits
// relative to the calendar edge. Returns a ref to attach to the element
// rendered inside the react-big-calendar event card.
export function useHoverShiftLeft<T extends HTMLElement>() {
    const ref = React.useRef<T | null>(null);

    React.useEffect(() => {
        const eventEl = ref.current?.closest(
            ".rbc-event"
        ) as HTMLElement | null;
        if (!eventEl) {
            return;
        }
        const calendarEl = eventEl.closest(
            ".rbc-calendar"
        ) as HTMLElement | null;
        const margin = 8;

        // Track the card's resting width so the hover state can never make it
        // narrower than it already is. It's kept up to date while the card is
        // not being hovered (its size depends on the calendar layout).
        let restingWidth = eventEl.getBoundingClientRect().width;
        let hovering = false;
        const resizeObserver = new ResizeObserver(() => {
            if (!hovering) {
                restingWidth = eventEl.getBoundingClientRect().width;
            }
        });
        resizeObserver.observe(eventEl);

        // Shift the card leftwards if expanding pushed its right edge past the
        // calendar's right edge, so it grows to the left instead of running off
        // the calendar.
        const reposition = () => {
            const rect = eventEl.getBoundingClientRect();
            const calendarRect = calendarEl?.getBoundingClientRect();
            const rightBound = calendarRect
                ? calendarRect.right
                : document.documentElement.clientWidth;
            const leftBound = calendarRect ? calendarRect.left : 0;
            // Never pull the card's right edge left of its resting footprint.
            // The pointer is hovering somewhere over that footprint, so
            // shrinking past it would uncover the pointer and fire
            // mouseleave -> reset -> mouseenter in a loop. The card therefore
            // only ever grows leftward beyond its resting bounds.
            const restingRight = rect.left + restingWidth;
            const targetRight = Math.max(rightBound - margin, restingRight);
            if (rect.right > targetRight) {
                if (eventEl.dataset.origLeft === undefined) {
                    eventEl.dataset.origLeft = eventEl.style.left ?? "";
                }
                const currentLeft =
                    parseFloat(getComputedStyle(eventEl).left) || 0;
                const overflow = rect.right - targetRight;
                // Clamp against the calendar's left edge rather than the
                // event's offset parent (`left: 0`). In the category view
                // events live inside narrow per-resource columns, so a
                // column-relative `0` can still sit past the calendar's right
                // edge; clamping to the calendar edge lets the card shift left
                // across columns far enough to stay in bounds.
                const offsetParentLeft = rect.left - currentLeft;
                const minLeft = leftBound + margin - offsetParentLeft;
                const newLeft = Math.max(minLeft, currentLeft - overflow);
                eventEl.style.left = `${newLeft}px`;
                eventEl.style.right = "auto";
            }
        };

        const onEnter = () => {
            hovering = true;
            // Floor the width at the resting width so the card only grows.
            eventEl.style.minWidth = `${Math.max(300, restingWidth)}px`;
            // Reposition synchronously. By the time mouseenter fires the :hover
            // styles are already applied, and reading getBoundingClientRect in
            // reposition() forces a synchronous reflow, so the expanded
            // measurements are accurate now. Doing this synchronously (rather
            // than in a deferred requestAnimationFrame) is important: a later
            // rAF could run mid-click and move the card out from under the
            // pointer between mousedown and mouseup, which cancels the click so
            // the popover never opens. The shift completes within mouseenter,
            // before any press is possible, so the card is stable when clicked.
            reposition();
        };

        const onLeave = () => {
            hovering = false;
            eventEl.style.minWidth = "";
            if (eventEl.dataset.origLeft !== undefined) {
                eventEl.style.left = eventEl.dataset.origLeft;
                eventEl.style.right = "";
                delete eventEl.dataset.origLeft;
            }
        };

        eventEl.addEventListener("mouseenter", onEnter);
        eventEl.addEventListener("mouseleave", onLeave);
        return () => {
            resizeObserver.disconnect();
            eventEl.removeEventListener("mouseenter", onEnter);
            eventEl.removeEventListener("mouseleave", onLeave);
            onLeave();
        };
    }, []);

    return ref;
}
