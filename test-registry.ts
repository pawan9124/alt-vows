import { registry } from './components/themes/registry';

console.log("Verifying Registry...");

if (registry['vintage-vinyl']) {
    console.log("✅ Registry contains 'vintage-vinyl'");
    if (typeof registry['vintage-vinyl'] === 'function' || typeof registry['vintage-vinyl'] === 'object') {
        console.log("✅ 'vintage-vinyl' appears to be a valid component/function");
    } else {
        console.error("❌ 'vintage-vinyl' is not a component", typeof registry['vintage-vinyl']);
    }
} else {
    console.error("❌ Registry missing 'vintage-vinyl'");
}
