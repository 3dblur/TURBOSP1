
---

### Comprehensive Implementation Guide for SP1 Integration in Game Score Provability

This section provides a detailed, step-by-step breakdown of every task the Cursor IDE agent must perform to integrate SP1 into your game, assuming it can execute all system-level, coding, and deployment tasks. Your game is a 3D racing experience using Three.js with a Node.js/Express backend and vanilla JavaScript frontend, where scores start at 1, increment by 1 per power-up collected, and add a 5-point bonus per correct quiz answer if the score exceeds 15 before the quiz. The goal is to make these scores provable using SP1, a zero-knowledge virtual machine (zkVM) from Succinct Labs, enabling blockchain-verifiable computations as of 08:15 PM PST on Saturday, March 08, 2025.

#### Step-by-Step Tasks for the Cursor IDE Agent

##### 1. Save the Guide in the Project
- **Task**: Create a file named `instructions_sp1.md` in the root directory (e.g., alongside `package.json` and `instructions.md`).
- **Details**: Write the entire guide content into `instructions_sp1.md`. Check for existing files with the same name; if found, rename the new file to `instructions_sp1_v1.md` to avoid duplicates.
- **Purpose**: Ensures the guide is stored as a reference within the project for documentation and version control.

##### 2. Set Up the Development Environment
- **Task 2.1**: Install Rust version 1.79.
  - **Command**: Run `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` in the terminal to install `rustup`.
  - **Command**: Run `rustup install 1.79` to set Rust to version 1.79.
  - **Verification**: Run `rustc --version` and confirm the output is `rustc 1.79.0`.
  - **Check**: Inspect the `~/.cargo` directory; if Rust is already installed, update it with `rustup update` to ensure version 1.79.
- **Task 2.2**: Install SP1 tools.
  - **Command**: Run `curl -L https://raw.githubusercontent.com/succinctlabs/sp1/main/install.sh | sh` to install SP1 CLI tools, following [SP1 Docs](https://docs.succinct.xyz/docs/introduction).
  - **Verification**: Run `sp1 --version` to confirm installation.
  - **Check**: Ensure no duplicate SP1 installations by verifying the `~/.sp1` directory; remove older versions if necessary with `rm -rf ~/.sp1` before reinstalling.

##### 3. Implement a Deterministic PRNG in `script.js`
- **Task 3.1**: Add an LCG class to `script.js`.
  - **Action**: Append the following code at the top of `script.js`:
    ```javascript
    class LCG {
      constructor(seed) {
        this.state = seed >>> 0; // Ensure unsigned 32-bit integer
      }
      next() {
        this.state = (1103515245 * this.state + 12345) & 0x7fffffff; // LCG formula
        return this.state / 0x7fffffff; // Normalize to [0, 1)
      }
    }
    ```
  - **Check**: Search `script.js` for existing PRNG implementations (e.g., `LCG`, `RNG`); if found, replace them with this version to avoid duplicates.
- **Task 3.2**: Set the PRNG seed at game start.
  - **Action**: In `script.js`, locate the game initialization (e.g., `init()` function around line 50-100), and add:
    ```javascript
    const gameSeed = Date.now(); // Use timestamp as seed
    const prng = new LCG(gameSeed);
    ```
- **Task 3.3**: Replace all `Math.random()` calls with `prng.next()`.
  - **Action**: Search `script.js` for `Math.random()` (e.g., in `spawnObject` around line 200-300) and replace each instance:
    - Original: `let x = Math.random() * 10 - 5;`
    - Updated: `let x = prng.next() * 10 - 5;`
  - **Count**: Approximately 5-10 replacements expected (e.g., object spawning, lane positions); ensure all are updated by searching exhaustively.
- **Task 3.4**: Store the seed for proof generation.
  - **Action**: Add a global variable at the top of `script.js`:
    ```javascript
    let currentSeed = null;
    ```
  - **Action**: In the initialization, set `currentSeed = gameSeed;` after creating the `prng`.

##### 4. Record Player Actions in `script.js`
- **Task 4.1**: Initialize action arrays.
  - **Action**: Add at the top of `script.js`:
    ```javascript
    let laneChanges = [];
    let quizAnswers = [];
    ```
- **Task 4.2**: Log lane changes.
  - **Action**: In `handleKeyPress` (around line 500-600), after lane change logic (e.g., `playerLane += 1`), add:
    ```javascript
    laneChanges.push({ time: Date.now(), newLane: playerLane });
    ```
- **Task 4.3**: Log quiz answers.
  - **Action**: In the quiz answer handler (e.g., `handleAnswer` around line 1500-1600), after checking correctness, add:
    ```javascript
    quizAnswers.push({ questionId: currentQuestion.id, answer: selectedAnswer, correct: isCorrect });
    ```
- **Task 4.4**: Send actions to the server.
  - **Action**: In the game-over logic (e.g., `gameOver` around line 2500), add:
    ```javascript
    fetch('/api/game-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed: currentSeed, laneChanges, quizAnswers })
    })
    .then(response => response.json())
    .then(data => console.log('Actions sent:', data));
    ```
  - **Check**: Ensure no duplicate fetch calls by searching for existing `/api/game-actions` requests.

##### 5. Write and Compile the SP1 Program
- **Task 5.1**: Create an SP1 project directory.
  - **Action**: Run `mkdir sp1` in the root directory; if `sp1/` exists, use `sp1_v1/` instead.
- **Task 5.2**: Create `score_prover.rs`.
  - **Action**: Create `sp1/score_prover.rs` with:
    ```rust
    use sp1_sdk::{SP1Stdin, SP1Stdout};

    pub fn main() {
        let mut stdin = SP1Stdin::new();
        let seed: u32 = stdin.read();
        let lane_changes: Vec<(u64, i32)> = stdin.read();
        let quiz_answers: Vec<(u32, u32, bool)> = stdin.read();

        let mut prng_state = seed;
        let mut score = 1; // Starting score
        let mut power_ups = 0;

        // Simulate game with discrete time steps (e.g., 60 FPS, 10 seconds)
        for t in 0..600 {
            prng_state = (1103515245 * prng_state + 12345) & 0x7fffffff;
            if prng_state % 100 < 5 { // 5% chance of power-up per frame
                power_ups += 1;
                score += 1;
            }
        }

        // Apply lane changes (simplified: assume they affect power-up collection)
        for (time, _lane) in lane_changes {
            if time < 600 * 16 { // Within 10 seconds (16ms per frame)
                prng_state = (1103515245 * prng_state + 12345) & 0x7fffffff;
            }
        }

        // Apply quiz bonus if score > 15
        if score > 15 {
            for (_qid, _ans, correct) in quiz_answers {
                if correct {
                    score += 5;
                }
            }
        }

        let mut stdout = SP1Stdout::new();
        stdout.write(score);
    }
    ```
- **Task 5.3**: Compile the SP1 program.
  - **Command**: Run `sp1 compile --input sp1/score_prover.rs --output sp1/score_prover.elf` in the terminal.
  - **Check**: Verify `sp1/score_prover.elf` exists; if it already exists, overwrite it.

##### 6. Set Up Server-Side Proof Generation
- **Task 6.1**: Install SP1 prover tools on the server.
  - **Command**: Run `curl -L https://raw.githubusercontent.com/succinctlabs/sp1/main/install.sh | sh` on the server environment.
  - **Verification**: Run `sp1-prover --version` to confirm.
- **Task 6.2**: Add a proof generation endpoint to `server.js`.
  - **Action**: Append to `server.js` (around line 60):
    ```javascript
    const { execSync } = require('child_process');

    app.post('/api/game-actions', (req, res) => {
      const { seed, laneChanges, quizAnswers } = req.body;
      const stdin = JSON.stringify({ seed, laneChanges, quizAnswers });
      fs.writeFileSync('sp1/input.json', stdin);
      execSync('sp1-prover prove --elf sp1/score_prover.elf --input sp1/input.json --output sp1/proof.json');
      const proof = JSON.parse(fs.readFileSync('sp1/proof.json', 'utf8'));
      res.json({ proof: proof.proof, score: proof.score });
    });
    ```
  - **Check**: Ensure `fs` and `app` (Express) are defined; add `const fs = require('fs');` at the top if missing.
  - **Check**: Verify no duplicate `/api/game-actions` routes by searching `server.js`.

##### 7. Integrate Client-Side Proof Verification
- **Task 7.1**: Download and compile the SP1 Wasm verifier.
  - **Command**: Run `git clone https://github.com/succinctlabs/example-sp1-wasm-verifier.git sp1-wasm-verifier`.
  - **Command**: Run `cd sp1-wasm-verifier && npm install && npm run build` to generate `verifier.js`.
- **Task 7.2**: Add the verifier to `script.js`.
  - **Action**: Copy `sp1-wasm-verifier/dist/verifier.js` to `public/verifier.js`.
  - **Action**: In `index.html`, add `<script src="/verifier.js"></script>` before `<script src="/script.js"></script>`.
- **Task 7.3**: Verify proofs in `script.js`.
  - **Action**: In the fetch response from Task 4.4, add:
    ```javascript
    .then(data => {
      const { proof, score } = data;
      const isValid = verifySP1Proof(proof, score); // Assumes verifier.js exposes this function
      if (isValid) {
        console.log('Proof verified, score:', score);
        submitToBlockchain(score, proof);
      } else {
        console.error('Invalid proof');
      }
    });
    ```

##### 8. Deploy and Integrate with Blockchain
- **Task 8.1**: Set up Hardhat for contract deployment.
  - **Command**: Run `npx hardhat init` in the root directory, selecting “Create a basic sample project”.
  - **Action**: Configure `hardhat.config.js` with your network (e.g., Ethereum Sepolia):
    ```javascript
    require('@nomiclabs/hardhat-ethers');
    module.exports = {
      solidity: "0.8.19",
      networks: { sepolia: { url: "YOUR_SEPOLIA_URL", accounts: ["YOUR_PRIVATE_KEY"] } }
    };
    ```
- **Task 8.2**: Deploy the SP1 verification contract.
  - **Action**: Download the SP1 contract from [SP1 Contracts](https://github.com/succinctlabs/sp1-contracts), save as `contracts/SP1Verifier.sol`.
  - **Command**: Run `npx hardhat deploy --network sepolia`.
- **Task 8.3**: Submit scores to the blockchain.
  - **Action**: Add ethers.js to `package.json`: Run `npm install ethers`.
  - **Action**: In `script.js`, add at the top:
    ```javascript
    const ethers = window.ethers || require('ethers');
    const contractAddress = "DEPLOYED_CONTRACT_ADDRESS";
    const abi = [ /* Paste ABI from Hardhat deployment */ ];
    ```
  - **Action**: Add the submission function:
    ```javascript
    async function submitToBlockchain(score, proof) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      await contract.submitScore(score, proof);
    }
    ```

#### Final Verification
- **Task**: Restart the server with `node server.js` and reload the game in the browser.
- **Check**: Play the game, collect power-ups, answer quizzes, and verify the score is submitted to the blockchain with a valid proof.

---
