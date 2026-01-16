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
];

const UkrainianWordOfTheDay: React.FC = () => {
    const classes = useStyles();
    const [word, setWord] = useState<Word>(words[0]);

    useEffect(() => {
        const updateWord = () => {
            // Use the day of the year to pick a word, based on "America/Edmonton" time
            const now = new Date();
            const timeZone = "America/Edmonton";
            const edmontonDateString = now.toLocaleString("en-US", { timeZone });
            const edmontonDate = new Date(edmontonDateString);

            const start = new Date(edmontonDate.getFullYear(), 0, 0);
            const diff = edmontonDate.getTime() - start.getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            const index = dayOfYear % words.length;
            setWord(words[index]);
        };

        updateWord();

        // Check regularly if the day has changed
        const interval = setInterval(updateWord, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

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
