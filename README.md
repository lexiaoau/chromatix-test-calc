# chromatix data processing test


## Prerequisites

NPM and NodeJS should be installed.
NPM module "inquirer" is needed to implement CLI menu.
 

## Installation

```
git clone https://github.com/lexiaoau/chromatix-test-calc.git

cd chromatix-test-calc

npm install

```

- The input data file should be put under sub-folder "data/".
- To save upload/download time, only a smaller input file called "sample.csv" is included.
	- To test the full data set, please copy the data file to "data/" and change code in "src/index.js" to point to it.


## Run

To run the application, use following commands:

```
npm start

```

- Then, the APP will read the data file and sort the data and this may take a few seconds.
- After reading finished, a CLI menu is presented and user can choose task number from the menu.
- After one task is chosen, the APP will output the task JSON result to a file and the file path will be printed. Then, it will show the menu again.
- To exit the CLI APP, choose "exit" from the menu.

## Code Explanation

1. Since speed is important, so ES5/6 loop, such as for..of / for..in is not used.
2. Some profilling code are included to show execution time, these code are labeld with "//// profilling code, can be deleted" and they all can be deleted without breaking functionality.

## Assumption

1. Assume the input data is all valid so no code added to verify input correctness.
2. Assume region name and country name are not duplicated.
3. Assume user don't need to provide input file name and it will be hard-coded.



