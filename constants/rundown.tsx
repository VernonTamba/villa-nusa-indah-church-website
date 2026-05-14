import {
  IconBook2,
  IconCoffee,
  IconMicrophone2,
  IconMusic,
  IconPackage,
  IconScanPosition,
  IconSparkles,
  IconUsersGroup,
} from "@tabler/icons-react";

export const RUNDOWN_ITEMS = [
  {
    title: "Sabbath School",
    time: "08:30 - 10:30",
    detail:
      "Sabbath School discussions to start the Sabbath on a spiritual note.",
    subdetail:
      "In Sabbath School worship, we start off with a few songs. Welcome and opening prayer are done by the Sabbath School leader. We have a special song, followed by a mission story. Deacons and deaconesses assist with the offering. The Sabbath School discussion is led by assigned groups, and we end with family worship or stewardship.",
    icon: IconBook2,
    participants: [
      {
        rundown: "Song Leader",
        participant: "Jane Doe",
        icon: <IconMicrophone2 />,
      },
      {
        rundown: "Pianist",
        participant: "Matthew Doe",
        icon: <IconMicrophone2 />,
      },
      {
        rundown: "Sabbath School Leader",
        participant: "John Doe",
        icon: <IconSparkles />,
      },
      {
        rundown: "Memory Verse & Opening Prayer",
        participant: "Rachel",
        icon: <IconScanPosition />,
      },
      {
        rundown: "Special Song",
        participant: "VNI Youth",
        icon: <IconMusic />,
      },
      { rundown: "Mission Story", participant: "Andry", icon: <IconBook2 /> },
      {
        rundown: "Deacons/Deaconesses",
        participant: "Mary and John",
        icon: <IconUsersGroup />,
      },
      {
        rundown: "Sabbath School Discussion",
        participant: "By Assigned Groups",
        icon: <IconBook2 />,
      },
      {
        rundown: "Family Worship / Stewardship",
        participant: "Momota",
        icon: <IconSparkles />,
      },
    ],
  },
  {
    title: "Divine Service",
    time: "10:30 - 12:00",
    detail: "Praise, prayer, and the main sermon for the day.",
    icon: IconMicrophone2,
    subdetail:
      "In Sabbath School worship, we start off with a few songs. Welcome and opening prayer are done by the Sabbath School leader. We have a special song, followed by a mission story. Deacons and deaconesses assist with the offering. The Sabbath School discussion is led by assigned groups, and we end with family worship or stewardship.",
    participants: [
      {
        rundown: "Song Leader",
        participant: "Jane Doe",
        icon: <IconMicrophone2 />,
      },
      {
        rundown: "Pianist",
        participant: "Matthew Doe",
        icon: <IconMicrophone2 />,
      },
      {
        rundown: "Responsive Reading",
        participant: "Pr. Michael",
        icon: <IconBook2 />,
      },
      {
        rundown: "Sermon",
        participant: "Pr. Michael",
        icon: <IconMicrophone2 />,
      },
      {
        rundown: "Pastoral Prayer",
        participant: "Pr. Michael",
        icon: <IconSparkles />,
      },
      {
        rundown: "Scripture Reading",
        participant: "Sis. Angela",
        icon: <IconBook2 />,
      },
      {
        rundown: "Main Message",
        participant: "Pr. Michael",
        icon: <IconMicrophone2 />,
      },
    ],
  },
  {
    title: "Potluck Fellowship",
    time: "12:00 - 14:00",
    detail: "A shared meal and warm conversations with the church family.",
    subdetail:
      "In Sabbath School worship, we start off with a few songs. Welcome and opening prayer are done by the Sabbath School leader. We have a special song, followed by a mission story. Deacons and deaconesses assist with the offering. The Sabbath School discussion is led by assigned groups, and we end with family worship or stewardship.",
    icon: IconCoffee,
    participants: [
      {
        rundown: "Meal Coordination",
        participant: "Hospitality Team",
        icon: <IconPackage />,
      },
      {
        rundown: "Table Hosting",
        participant: "Family Ministries",
        icon: <IconUsersGroup />,
      },
      {
        rundown: "Guest Welcome",
        participant: "Ushering Team",
        icon: <IconUsersGroup />,
      },
    ],
  },
  {
    title: "Choir Practice",
    time: "14:00 - 15:00",
    detail: "Song rehearsal and preparation for upcoming worship services.",
    subdetail:
      "In Sabbath School worship, we start off with a few songs. Welcome and opening prayer are done by the Sabbath School leader. We have a special song, followed by a mission story. Deacons and deaconesses assist with the offering. The Sabbath School discussion is led by assigned groups, and we end with family worship or stewardship.",
    icon: IconMusic,
    participants: [
      {
        rundown: "Warm-up and Vocal Drill",
        participant: "Choir Director",
        icon: <IconMicrophone2 />,
      },
      {
        rundown: "Special Number Rehearsal",
        participant: "Alto and Tenor Sections",
        icon: <IconMusic />,
      },
      {
        rundown: "Closing Run-through",
        participant: "Full Choir",
        icon: <IconMicrophone2 />,
      },
    ],
  },
  {
    title: "Adventist Youth Fellowship",
    time: "15:00 - 18:00",
    detail: "Youth-led worship, activities, and spiritual reflection.",
    subdetail:
      "Youth fellowship closes the Sabbath with praise, Bible reflection, group activities, and a time of prayerful commitment together.",
    icon: IconUsersGroup,
    participants: [
      {
        rundown: "Praise and Worship",
        participant: "AY Music Team",
        icon: <IconMicrophone2 />,
      },
      {
        rundown: "Interactive Bible Talk",
        participant: "Youth Leader Karen",
        icon: <IconBook2 />,
      },
      {
        rundown: "Group Activity",
        participant: "AY Officers",
        icon: <IconUsersGroup />,
      },
      {
        rundown: "Commitment Prayer",
        participant: "Bro. Nathan",
        icon: <IconSparkles />,
      },
    ],
  },
] as const;

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
