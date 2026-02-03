import { mergeConfig, defaultContent } from './components/themes/vintage-vinyl/config';

console.log("Running Config Engine Tests...");

// TEST 1: EMPTY INPUT
const result1 = mergeConfig({});
if (result1.hero.title === defaultContent.hero.title &&
    result1.style.primaryColor === defaultContent.style.primaryColor) {
    console.log("✅ Custom Test 1 Passed: Empty input returns defaults");
} else {
    console.error("❌ Custom Test 1 Failed", result1);
}

// TEST 2: PARTIAL OVERRIDE
const overrideData = {
    h1: "Rock Wedding",
    color: "#ff0000"
};
const result2 = mergeConfig(overrideData);
if (result2.hero.title === "Rock Wedding" &&
    result2.style.primaryColor === "#ff0000" &&
    result2.hero.names === defaultContent.hero.names) { // Should preserve other defaults
    console.log("✅ Custom Test 2 Passed: Partial override works");
} else {
    console.error("❌ Custom Test 2 Failed", result2);
}

// TEST 3: AUDIO OVERRIDE
const audioData = {
    audio: "/custom.mp3"
};
const result3 = mergeConfig(audioData);
if (result3.style.audioTrack === "/custom.mp3") {
    console.log("✅ Custom Test 3 Passed: Audio override works");
} else {
    console.error("❌ Custom Test 3 Failed", result3);
}

console.log("All tests completed.");
