const calculatePriority = (task) => {
  let score = 0;

  const descriptionLength = task.description.length;
  if (descriptionLength < 10) {
    score += 1;
  } else if (descriptionLength <= 20) {
    score += 2;
  } else {
    score += 3;
  }

  const titleLength = task.title.length;
  if (titleLength < 5) {
    score += 0.5;
  } else if (titleLength <= 15) {
    score += 1;
  } else {
    score += 1.5;
  }

  const keywords = ['urgent', 'important', 'low-priority'];
  const keywordScores = {
    urgent: 2,
    important: 1.5,
    'low-priority': -1,
  };

  keywords.forEach((keyword) => {
    if (task.title.toLowerCase().includes(keyword) || task.description.toLowerCase().includes(keyword)) {
      score += keywordScores[keyword];
    }
  });

  const currentDate = new Date();
  const taskDate = new Date(task.createdAt);
  const timeDifference = currentDate - taskDate;
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  if (hoursDifference <= 24) {
    score += 1;
  }

  const maxScore = 8.5;
  const weightedScore = (score * 100) / maxScore;
  return Math.min(1, Math.max(0, weightedScore / 100));
};

module.exports = { 
  calculatePriority,
};
