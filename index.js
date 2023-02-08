// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

function runBatch(startedNum) {
  // mocking this out with a random timeout for the purposes of the snippet.
  return new Promise((resolve, reject) => {
    if (startedNum === 2) {
      resolve(startedNum);
    } else {
      reject(startedNum);
    }
  });
}

function doAll(totalRecords, maxConcurrent) {
  return new Promise((resolve) => {
    let started = 0;
   
    let solvedList = [];
    let failedList = [];

    // Every time we start a task we'll do this
    const batchQueue = () => {
      started++;
      console.log('starting', started);

      // I assume you want errors to count as done and move on to the next
      runBatch(started)
        .then((onSettled) => {
          // console.log('onSettled', onSettled);
          
          solvedList.push(onSettled);
          if (started < totalRecords.length) {
            batchQueue();
          }
          if (failedList.length + solvedList.length === totalRecords.length) {
            return resolve({ solvedList, failedList });
          }
        })
        .catch((onFailed) => {
          // console.log('onFailed', onFailed);
          failedList.push(onFailed);

          if (started < totalRecords.length) {
            batchQueue();
          }
          if (failedList.length + solvedList.length === totalRecords.length) {
            return resolve({ solvedList, failedList });
          }
        });
    };

    // Every time we finish a task, we'll do this:

    // Start the initial batch going.
    while (started < maxConcurrent && started < totalRecords.length) {
      batchQueue();
    }
  });
}

doAll([1,2,3,4,5,6,7,8,9,10], 5).then((finishedList) => {
  console.log('finishedList', finishedList);
  console.log('all done');
});
