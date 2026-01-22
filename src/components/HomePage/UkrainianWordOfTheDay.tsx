import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1),
        textAlign: "center",
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.primary,
        minWidth: 275,
        maxWidth: 600,
    },
    word: {
        fontSize: "2.5rem",
        fontWeight: "bold",
    },
    translation: {
        fontSize: "1.5rem",
        fontStyle: "italic",
    },
    pronunciation: {
        fontSize: "1rem",
        color: "rgba(0, 0, 0, 0.6)",
    },
}));

const TIMEZONE = "America/Edmonton";

type Word = {
    ukrainian: string;
    english: string;
    pronunciation: string;
};

const words: Word[] = [
    { ukrainian: "Привіт", english: "Hello", pronunciation: "Pry-vit" },
    { ukrainian: "Дякую", english: "Thank you", pronunciation: "Dya-ku-yu" },
    { ukrainian: "Будь ласка", english: "Please / You're welcome", pronunciation: "Bud las-ka" },
    { ukrainian: "Добрий день", english: "Good day", pronunciation: "Dob-ry den" },
    { ukrainian: "Слава Україні", english: "Glory to Ukraine", pronunciation: "Sla-va U-kra-i-ni" },
    { ukrainian: "Кохання", english: "Love", pronunciation: "Ko-khan-nya" },
    { ukrainian: "Друг", english: "Friend", pronunciation: "Druh" },
    { ukrainian: "Родина", english: "Family", pronunciation: "Ro-dy-na" },
    { ukrainian: "Свято", english: "Holiday / Celebration", pronunciation: "Svya-to" },
    { ukrainian: "Музика", english: "Music", pronunciation: "Mu-zy-ka" },
    { ukrainian: "Танець", english: "Dance", pronunciation: "Ta-nets" },
    { ukrainian: "Вареники", english: "Dumplings (Varenyky)", pronunciation: "Va-re-ny-ky" },
    { ukrainian: "Борщ", english: "Borscht", pronunciation: "Borshch" },
    { ukrainian: "Вишиванка", english: "Embroidered shirt", pronunciation: "Vy-shy-van-ka" },
    { ukrainian: "Волонтер", english: "Volunteer", pronunciation: "Vo-lon-ter" },
    { ukrainian: "Фестиваль", english: "Festival", pronunciation: "Fes-ty-val" },
    { ukrainian: "Допомога", english: "Help", pronunciation: "Do-po-mo-ha" },
    { ukrainian: "Громада", english: "Community", pronunciation: "Hro-ma-da" },
    { ukrainian: "Культура", english: "Culture", pronunciation: "Kul-tu-ra" },
    { ukrainian: "Традиція", english: "Tradition", pronunciation: "Tra-dy-tsi-ya" },
    { ukrainian: "Команда", english: "Team", pronunciation: "Ko-man-da" },
    { ukrainian: "Гість", english: "Guest", pronunciation: "Hist" },
    { ukrainian: "Сцена", english: "Stage", pronunciation: "Stse-na" },
    { ukrainian: "Їжа", english: "Food", pronunciation: "Yi-zha" },
];

const UkrainianWordOfTheDay: React.FC = () => {
    const classes = useStyles();
    const [word, setWord] = useState<Word>(words[0]);

    useEffect(() => {
        let timeoutId: any;

        const updateWord = () => {
            // Use the day of the year to pick a word, calculated in a fixed "America/Edmonton"
            // timezone instead of the user's local timezone. This ensures that all users see
            // the same "word of the day" rollover moment globally, using Edmonton time as the
            // canonical reference for this project.
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-CA", {
                timeZone: TIMEZONE,
                year: "numeric",
                month: "numeric",
                day: "numeric",
            });
            const parts = formatter.formatToParts(now);
            const year = Number(parts.find((p) => p.type === "year")?.value);
            const month = Number(parts.find((p) => p.type === "month")?.value);
            const day = Number(parts.find((p) => p.type === "day")?.value);
            const edmontonDate = new Date(year, month - 1, day);

            const start = new Date(edmontonDate.getFullYear(), 0, 1);
            const diff = edmontonDate.getTime() - start.getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            const index = dayOfYear % words.length;
            setWord(words[index]);

            // Calculate time until next midnight in "America/Edmonton"
            const timeFormatter = new Intl.DateTimeFormat("en-US", {
                timeZone: TIMEZONE,
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            });
            const timeParts = timeFormatter.formatToParts(now);
            const h = Number(timeParts.find((p) => p.type === "hour")?.value);
            const m = Number(timeParts.find((p) => p.type === "minute")?.value);
            const s = Number(timeParts.find((p) => p.type === "second")?.value);

            // Handle potential 24-hour clock issues
            const hour = h === 24 ? 0 : h;
            const msPassed = (hour * 3600 + m * 60 + s) * 1000 + now.getMilliseconds();
            const msUntilMidnight = 86400000 - msPassed;

            // Schedule the next update
            timeoutId = setTimeout(updateWord, msUntilMidnight + 1000);
        };

        updateWord();

        return () => clearTimeout(timeoutId);
    }, [words]);

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Ukrainian Word of the Day
                </Typography>
                <Typography className={classes.word}>
                    {word.ukrainian}
                </Typography>
                <Typography className={classes.pronunciation} gutterBottom>
                    ({word.pronunciation})
                </Typography>
                <Typography className={classes.translation}>
                    {word.english}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default UkrainianWordOfTheDay;
