const colorList = [
  "#162d24",
  "#19392c",
  "#1d4534",
  "#20513d",
  "#225e45",
  "#246c4e",
  "#257a57",
  "#268860",
  "#279768",
  "#27a671",
  "#27b67b",
  "#26c684",
  "#24d68d",
  "#2bdf95",
  "#35e49c",
  "#40e9a3",
  "#4aedaa",
  "#56f1b1",
  "#61f5b8",
  "#6df8bf",
];

export const getRandomHexColor = (id: number): string => {
  return colorList[id % colorList.length];
};
