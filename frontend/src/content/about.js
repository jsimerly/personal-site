// The About page, in my own words: the person, not the resume. No pitch and
// no call to action here; the rest of the site does that.
//
// - `intro` is a paragraph or two, each string one paragraph.
// - `facts` are one-liners, a label and what goes with it, in the order
//   they're shown.
// - `photos` are candid shots, files under public/about/ (e.g.
//   'about/draft-day.jpg'), each with the words a screen reader gets. The
//   grid shows once there are any.
//
// Anything in [brackets] would be a placeholder; a test keeps them off the page.
export const about = {
  intro: [
    "I'm Jacob. I build data platforms for a living, and the rest of the time I build things I want to exist: a data lake for my fantasy leagues, an app that runs a weekend of games for my friends, this site.",
  ],
  facts: [
    { label: 'Home', value: 'Indianapolis, born and raised, and still here.' },
    { label: 'School', value: 'Ball State: a math major and an economics major in one degree, with a minor in computer science.' },
    { label: 'Married', value: 'To Emily.' },
    {
      label: 'Fantasy football',
      value: 'Three dynasty leagues and a few redrafts every year. The data lake and the models started as a way to win them.',
    },
    { label: 'Brolympics', value: 'A yearly competition with my friends, on and off since 2014. These days the app runs it.' },
    { label: 'Teams', value: 'Colts and Hoosiers. In esports, CLG and Team Liquid.' },
    { label: 'Playing', value: 'Golf and pickleball, mostly.' },
    {
      label: 'On the table',
      value: 'Terraforming Mars first, then Wingspan, War Chest, and the Game of Thrones board game. I built Dominion in Python to see why it works.',
    },
    { label: 'On the screen', value: 'Competitive games, mostly: League of Legends and Overwatch.' },
    { label: 'Right now', value: 'Teaching a model to value every NFL player ten seasons out.' },
  ],
  photos: [],
}
