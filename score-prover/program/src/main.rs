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