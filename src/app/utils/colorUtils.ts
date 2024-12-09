const colorList = [
  "#8DBDD8", // Peaceful Blue
  "#A7BFE2", // Angel Blue
  "#6CCFF6", // Bright Blue
  "#28A2CB", // Turquoise Blue
  "#0084CA", // Happy Blue
  "#0067A5", // Royal Blue
  "#32488F", // Blueberry
  "#D1E0E9", // Ice Blue
  "#9AD9DB", // Robins Blue
  "#5DC0CE", // Happy Sky
  "#7ED3C4", // Aqua Blue
  "#A1CB83", // Fresh Green
  "#7FB77E", // Pistachio
  "#A8C4A0", // Celery Green
  "#CBD4C2", // Seafoam
  "#F8D3E0", // Pastel Pink
  "#FFB2C1", // Cotton Candy
  "#EBAAC1", // Dusty Rose
  "#FA8993", // Sweet Pink
  "#F79B99", // Rose
  "#FA6E79", // Hot Pink
  "#FFD6DC", // Pale Peach
  "#FFCCB6", // Peach
  "#F6AD9C", // Light Coral
  "#E86A6E", // Honey Suckle
  "#FFB347", // Happy Orange
  "#F47C3C", // Tangerine
  "#E94E3C", // Tango
  "#D45D43", // Burnt Orange
  "#FFF275", // Buttercup
  "#FFD86E", // Vanilla
  "#FBC26E", // Honey
  "#F8D64E", // Bright Yellow
  "#A6A5A1", // Soft Gray
  "#DCC1AC", // Sand
  "#C8A27C", // Camel
];
export const getRandomHexColor = (id: number): string => {
  return colorList[id % colorList.length];
};
