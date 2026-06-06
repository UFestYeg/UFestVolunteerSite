from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class DateRangeFilter(admin.FieldListFilter):
    """A reusable admin list filter that lets staff filter a date/datetime
    field by an inclusive ``from``/``to`` range using native date inputs.

    Works on both direct and related field paths (e.g.
    ``role__category__start_time``). Pair it with a field in ``list_filter``::

        list_filter = [("start_time", DateRangeFilter)]
    """

    template = "admin/date_range_filter.html"

    def __init__(self, field, request, params, model, model_admin, field_path):
        # Build the lookup keys before calling super(), because the base
        # ``FieldListFilter.__init__`` calls ``expected_parameters`` which
        # relies on them being set.
        self.lookup_kwarg_since = "%s__date__gte" % field_path
        self.lookup_kwarg_until = "%s__date__lte" % field_path
        super().__init__(field, request, params, model, model_admin, field_path)
        # Read the raw values straight from the query string so rendering and
        # filtering stay consistent across Django param-parsing changes.
        self.form_since = request.GET.get(self.lookup_kwarg_since, "")
        self.form_until = request.GET.get(self.lookup_kwarg_until, "")
        # Preserve every other active query parameter as hidden form inputs so
        # submitting the range form does not drop other filters/search/sort.
        self.hidden_params = [
            (key, value)
            for key, value in request.GET.items()
            if key
            not in (self.lookup_kwarg_since, self.lookup_kwarg_until, "p")
        ]

    def expected_parameters(self):
        return [self.lookup_kwarg_since, self.lookup_kwarg_until]

    def queryset(self, request, queryset):
        filters = {}
        if self.form_since:
            filters[self.lookup_kwarg_since] = self.form_since
        if self.form_until:
            filters[self.lookup_kwarg_until] = self.form_until
        if not filters:
            return queryset
        try:
            return queryset.filter(**filters)
        except (ValueError, ValidationError):
            return queryset

    def choices(self, changelist):
        # A single "clear" entry used by the template to reset the range.
        yield {
            "selected": not (self.form_since or self.form_until),
            "query_string": changelist.get_query_string(
                remove=[self.lookup_kwarg_since, self.lookup_kwarg_until]
            ),
            "display": _("All"),
        }
