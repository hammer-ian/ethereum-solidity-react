const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, "build");
//delete build folder and contents to ensure we are starting from fresh
console.log("INFO: Deleting old build directory");
fs.removeSync(buildPath);

//get path to contracts (source code) directory
const contractDirPath = path.resolve(__dirname, "contracts");
console.log("INFO: Contracts directory file path is ", contractDirPath);

//get all files in contract directory
console.log("INFO: Reading all contract files in contracts directory");
const fileNames = fs.readdirSync(contractDirPath);
console.log("INFO: Filesnames are", fileNames);

// Create the Solidity Compiler Standard Input JSON with the sourecode from ALL files
// Array reduce() combines all array elements into a single output value
// ... (3 dots) special notation means iterate through
const compilerInput = {
    language: "Solidity",
    sources: fileNames.reduce((reduceOutput, fileName) => {
        const filePath = path.resolve(contractDirPath, fileName); 
        const source = fs.readFileSync(filePath, "utf8");
        return { ...reduceOutput, [fileName]: { content: source } };
      }, {}),
    settings: { 
        outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } 
    },
  };
  console.log("INFO: Logging compilerInput");
  console.log(compilerInput);

// Compile All contracts. 
// JSON.parse() takes a JSON string and transforms it into a JavaScript object.
// JSON.stringify() takes a JavaScript object and transforms it into a JSON string.
const compilerOutput = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
console.log("INFO: Logging compilerOutput");
console.log(compilerOutput.contracts);

//recreate build folder ready to compiled output
console.log("INFO: Creating new build directory");
fs.ensureDirSync(buildPath);

//Start writing compiled solidity output to disk, one output file per contract
//for each file in the directory
fileNames.map((fileName) => {
    //get all contract objects associated with the fileName
    const contracts = Object.keys(compilerOutput.contracts[fileName]);
    //for each contract
    contracts.map((contract) => {
      //write the contract as a JSON to the build directory
      fs.outputJsonSync(
        path.resolve(buildPath, contract + ".json"),
        compilerOutput.contracts[fileName][contract]
      );
    });
  });