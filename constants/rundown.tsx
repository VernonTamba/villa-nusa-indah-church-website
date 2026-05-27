// Icon names are stored as plain strings so this constant is fully serializable
// and can be safely passed across the RSC → Client Component boundary.
// Resolve the string to an actual component in the Client Component using RUNDOWN_ICON_MAP.

export const RUNDOWN_ITEMS = [
  {
    title: "Sabbath School",
    time: "08:30 - 10:30",
    detail:
      "Sabbath School discussions to start the Sabbath on a spiritual note.",
    subdetail:
      "In Sabbath School worship, we start off with a few songs. The Sabbath School leader opens with a welcome and prayer. We have a mission story, special song, offering assisted by deacons and deaconesses, a lesson discussion, stewardship moment, and a closing prayer.",
    icon: "IconBook2",
    image: "https://picsum.photos/seed/vni-ss/800/400",
    participants: [
      {
        rundown: "Song Leader",
        participant: "TBD",
        icon: "IconMicrophone2",
      },
      {
        rundown: "Pianist",
        participant: "TBD",
        icon: "IconMicrophone2",
      },
      {
        rundown: "Sabbath School Leader",
        participant: "TBD",
        icon: "IconSparkles",
      },
      {
        rundown: "Memory Verse & Opening Prayer",
        participant: "TBD",
        icon: "IconScanPosition",
      },
      {
        rundown: "Mission Story",
        participant: "TBD",
        icon: "IconBook2",
      },
      {
        rundown: "Special Song",
        participant: "TBD",
        icon: "IconMusic",
      },
      {
        rundown: "Deacons/Deaconesses",
        participant: "TBD",
        icon: "IconUsersGroup",
      },
      {
        rundown: "Sabbath School Discussion",
        participant: "TBD",
        icon: "IconBook2",
      },
      {
        rundown: "Personal Ministry / Family & Health",
        participant: "TBD",
        icon: "IconSparkles",
      },
      {
        rundown: "Closing Prayer",
        participant: "TBD",
        icon: "IconScanPosition",
      },
    ],
  },
  {
    title: "Divine Service",
    time: "10:30 - 12:00",
    detail: "Praise, prayer, and the main sermon for the day.",
    icon: "IconMicrophone2",
    subdetail:
      "Divine Service opens with congregational singing and piano accompaniment. The service includes responsive reading, intercessory prayer, offering with prayer, assistance from deacons and deaconesses, a children's story, special song, the main sermon, and a closing benediction.",
    image: "https://picsum.photos/seed/vni-ds/800/400",
    participants: [
      {
        rundown: "Song Leader",
        participant: "TBD",
        icon: "IconMicrophone2",
      },
      {
        rundown: "Pianist",
        participant: "TBD",
        icon: "IconMicrophone2",
      },
      {
        rundown: "Responsive Reading",
        participant: "TBD",
        icon: "IconBook2",
      },
      {
        rundown: "Intercessory Prayer",
        participant: "TBD",
        icon: "IconSparkles",
      },
      {
        rundown: "Offering Reading & Prayer",
        participant: "TBD",
        icon: "IconScanPosition",
      },
      {
        rundown: "Deacons/Deaconesses",
        participant: "TBD",
        icon: "IconUsersGroup",
      },
      {
        rundown: "Children's Story",
        participant: "TBD",
        icon: "IconBook2",
      },
      {
        rundown: "Special Song",
        participant: "TBD",
        icon: "IconMusic",
      },
      {
        rundown: "Sermon",
        participant: "TBD",
        icon: "IconMicrophone2",
      },
      {
        rundown: "Benediction",
        participant: "TBD",
        icon: "IconSparkles",
      },
    ],
  },
  {
    title: "Potluck Fellowship",
    time: "12:00 - 14:00",
    detail: "A shared meal and warm conversations with the church family.",
    subdetail:
      "Potluck fellowship is a time to get to know one another, welcome guests, and enjoy community after worship. No structured rundown — just good food and warm fellowship.",
    icon: "IconCoffee",
    image: "https://picsum.photos/seed/vni-potluck/800/400",
    participants: [],
  },
  {
    title: "Choir Practice",
    time: "14:00 - 15:00",
    detail: "Song rehearsal and preparation for upcoming worship services.",
    subdetail:
      "The choir gathers to rehearse vocals, harmonies, and ministry songs so they can serve with readiness and heart. Open to all choir members.",
    icon: "IconMusic",
    image: "https://picsum.photos/seed/vni-choir/800/400",
    participants: [],
  },
  {
    title: "Adventist Youth Fellowship",
    time: "15:00 - 18:00",
    detail: "Youth-led worship, activities, and spiritual reflection.",
    subdetail:
      "Youth fellowship closes the Sabbath with praise, Bible reflection, group activities, games, and a time of prayerful commitment together.",
    icon: "IconUsersGroup",
    image: "https://picsum.photos/seed/vni-ay/800/400",
    participants: [
      {
        rundown: "Song Leader",
        participant: "TBD",
        icon: "IconMicrophone2",
      },
      {
        rundown: "Pianist",
        participant: "TBD",
        icon: "IconMicrophone2",
      },
      {
        rundown: "MC",
        participant: "TBD",
        icon: "IconSparkles",
      },
      {
        rundown: "AY Motto, Aim & Pledge",
        participant: "TBD",
        icon: "IconScanPosition",
      },
      {
        rundown: "Memory Verse & Opening Prayer",
        participant: "TBD",
        icon: "IconScanPosition",
      },
      {
        rundown: "Energizer",
        participant: "TBD",
        icon: "IconUsersGroup",
      },
      {
        rundown: "Bible Games",
        participant: "TBD",
        icon: "IconBook2",
      },
      {
        rundown: "Special Song",
        participant: "TBD",
        icon: "IconMusic",
      },
      {
        rundown: "Main Program",
        participant: "TBD",
        icon: "IconSparkles",
      },
      {
        rundown: "Devotional",
        participant: "TBD",
        icon: "IconBook2",
      },
    ],
  },
];

export type ScrollMoment = {
  label: string;
  title: string;
  description: string;
  image: string;
};

export const SCROLL_MOMENTS: ScrollMoment[] = [
  {
    label: "Moment 01",
    title: "A soft start before worship begins",
    description:
      "Temporary image placeholder for the welcome moments, greetings, and early arrivals before the service starts.",
    image: "https://picsum.photos/seed/vni-rundown-1/1400/1800",
  },
  {
    label: "Moment 02",
    title: "Voices rising together in praise",
    description:
      "This is standing in for future worship photos and helps the section feel alive while the real gallery is being prepared.",
    image: "https://picsum.photos/seed/vni-rundown-2/1400/1800",
  },
  {
    label: "Moment 03",
    title: "Scripture, stillness, and reflection",
    description:
      "A placeholder frame for the quieter parts of the day, where the room settles and attention turns toward the message.",
    image: "https://picsum.photos/seed/vni-rundown-3/1400/1800",
  },
  {
    label: "Moment 04",
    title: "Shared meals and joyful conversations",
    description:
      "This will eventually be swapped for fellowship photography, but for now it keeps the story of the day flowing visually.",
    image: "https://picsum.photos/seed/vni-rundown-4/1400/1800",
  },
  {
    label: "Moment 05",
    title: "Ending the Sabbath with warmth",
    description:
      "A final placeholder image for the closing rhythm of the day, leaving the section with a calm and gracious finish.",
    image: "https://picsum.photos/seed/vni-rundown-5/1400/1800",
  },
];
