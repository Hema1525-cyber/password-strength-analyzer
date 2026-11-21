  // Small list of very common passwords to reject (a real tool would use a bigger list)
  const COMMON = ["password","123456","12345678","qwerty","abc123","admin","welcome",
    "letmein","iloveyou","password1","111111","123123","india123","tamilnadu"];

  const rules = [
    { text: "At least 12 characters", test: p => p.length >= 12 },
    { text: "Has lowercase letters",  test: p => /[a-z]/.test(p) },
    { text: "Has uppercase letters",  test: p => /[A-Z]/.test(p) },
    { text: "Has numbers",            test: p => /\d/.test(p) },
    { text: "Has symbols (!@#$...)",  test: p => /[^A-Za-z0-9]/.test(p) },
    { text: "Not a common password",  test: p => p.length > 0 && !COMMON.some(c => p.toLowerCase().includes(c)) },
    { text: "No 3 repeated characters in a row", test: p => p.length > 0 && !/(.)\1\1/.test(p) }
  ];

  const pw = document.getElementById("pw");
  const fill = document.getElementById("fill");
  const label = document.getElementById("label");
  const crack = document.getElementById("crack");
  const checks = document.getElementById("checks");

  // Entropy = length x log2(character pool size)
  function entropy(p) {
    let pool = 0;
    if (/[a-z]/.test(p)) pool += 26;
    if (/[A-Z]/.test(p)) pool += 26;
    if (/\d/.test(p)) pool += 10;
    if (/[^A-Za-z0-9]/.test(p)) pool += 32;
    return pool ? p.length * Math.log2(pool) : 0;
  }

  // Assumes an attacker making 10 billion guesses per second
  function crackTime(bits) {
    const seconds = Math.pow(2, bits) / 1e10 / 2;
    if (seconds < 1) return "instantly";
    const units = [["years", 31557600], ["days", 86400], ["hours", 3600], ["minutes", 60], ["seconds", 1]];
    if (seconds > 31557600 * 1e9) return "billions of years+";
    for (const [name, size] of units) {
      if (seconds >= size) return Math.round(seconds / size).toLocaleString() + " " + name;
    }
  }

  function update() {
    const p = pw.value;
    checks.innerHTML = "";
    let passed = 0;
    rules.forEach(r => {
      const ok = r.test(p);
      if (ok) passed++;
      const li = document.createElement("li");
      li.className = ok ? "ok" : "no";
      li.textContent = r.text;
      checks.appendChild(li);
    });

    if (!p) { fill.style.width = "0"; label.textContent = "Enter a password"; crack.textContent = ""; return; }

    const bits = entropy(p);
    let level = ["Weak", "var(--weak)", 25];
    if (passed >= 4 && bits >= 40) level = ["Fair", "var(--fair)", 50];
    if (passed >= 6 && bits >= 60) level = ["Good", "var(--good)", 75];
    if (passed === rules.length && bits >= 75) level = ["Strong", "var(--strong)", 100];
    if (!rules[5].test(p)) level = ["Weak", "var(--weak)", 15];

    fill.style.width = level[2] + "%";
    fill.style.background = level[1];
    label.textContent = level[0] + " (" + Math.round(bits) + " bits)";
    crack.textContent = "Crack time: " + crackTime(bits);
  }

  document.getElementById("toggle").addEventListener("click", e => {
    const hidden = pw.type === "password";
    pw.type = hidden ? "text" : "password";
    e.target.textContent = hidden ? "Hide" : "Show";
  });

  document.getElementById("gen").addEventListener("click", () => {
    const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*";
    const arr = new Uint32Array(16);
    crypto.getRandomValues(arr);
    const result = Array.from(arr, n => chars[n % chars.length]).join("");
    document.getElementById("out").textContent = result;
    pw.value = result;
    update();
  });

  pw.addEventListener("input", update);
  update();
