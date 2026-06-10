import fs from "fs";
import path from "path";

const root = process.cwd();
const files = [
  "src/components/AccountActivation/AccountActivation.tsx",
  "src/components/Calendar/CalendarToolbar.tsx",
  "src/components/Calendar/CategoryFilter.tsx",
  "src/components/Calendar/EventCategory.tsx",
  "src/components/Calendar/EventDetail.tsx",
  "src/components/Calendar/EventsCategoryView.tsx",
  "src/components/Calendar/EventsDetailView.tsx",
  "src/components/Calendar/MySchedule.tsx",
  "src/components/Calendar/RequestEvent.tsx",
  "src/components/CategorySelectPage/CategorySelectPage.tsx",
  "src/components/Form/Form.tsx",
  "src/components/HomePage/HomePage.tsx",
  "src/components/HomePage/UkrainianWordOfTheDay.tsx",
  "src/components/LandingPage/LandingPage.tsx",
  "src/components/Loading/Loading.tsx",
  "src/components/LoginPage/LoginPage.tsx",
  "src/components/PasswordChange/PasswordChange.tsx",
  "src/components/PasswordReset/PasswordReset.tsx",
  "src/components/PasswordResetConfirm/PasswordResetConfirm.tsx",
  "src/components/PasswordResetDone/PasswordResetDone.tsx",
  "src/components/PositionRequestPage/PositionRequestPage.tsx",
  "src/components/ProfileEditPage/ProfileEditPage.tsx",
  "src/components/ProfilePage/ProfileInfo.tsx",
  "src/components/ProfilePage/VolunteerScheduleSummary.tsx",
  "src/components/RoleSelectPage/RoleSelectPage.tsx",
  "src/components/SignUpPage/SignUpPage.tsx",
  "src/components/SignupDone/SignupDone.tsx",
  "src/components/Tabs/Tabs.tsx",
  "src/components/VolunteerCategoryDetails/VolunteerCategoryDetails.tsx",
  "src/components/VolunteerCategoryList/VolunteerCategoryList.tsx",
  "src/containers/NavDrawer/NavDrawer.tsx",
  "src/containers/ProfileBase/ProfileBase.tsx",
];
// Header.tsx handled manually (useStyles params). CategoryFilter withStyles call handled manually.

for (const rel of files) {
  const fp = path.join(root, rel);
  let s = fs.readFileSync(fp, "utf8");
  const orig = s;

  // Remove createStyles import lines
  s = s.replace(/^import createStyles from '@mui\/styles\/createStyles';\n/gm, "");
  // makeStyles import -> tss-react
  s = s.replace(/^import makeStyles from '@mui\/styles\/makeStyles';$/gm, 'import { makeStyles } from "tss-react/mui";');
  // withStyles import -> tss-react
  s = s.replace(/^import withStyles from '@mui\/styles\/withStyles';$/gm, 'import { withStyles } from "tss-react/mui";');
  // Strip createStyles( wrapper -> (
  s = s.replace(/createStyles\(/g, "(");
  // makeStyles definition -> tss-react curried form
  s = s.replace(/= makeStyles\(/g, "= makeStyles()(");
  // useStyles call sites
  s = s.replace(/const classes = useStyles\([^)]*\);/g, "const { classes } = useStyles();");
  s = s.replace(/const styles = useStyles\([^)]*\);/g, "const { classes: styles } = useStyles();");

  if (s !== orig) {
    fs.writeFileSync(fp, s, "utf8");
    console.log("modified", rel);
  } else {
    console.log("UNCHANGED", rel);
  }
}
