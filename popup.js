// Paste your free API key from Google AI Studio here
const GEMINI_API_KEY = "AIzaSyDMzs94ZSM1ieHLISQG53VdnQTvESf-SH8"; 

// Your father's UPI handle hardcoded securely
const FATHER_UPI_ID = "pratim.baruah6@okhdfcbank"; 

document.getElementById('scan-btn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('scan-status');
  statusDiv.innerText = "Parsing profile elements locally...";
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes("://linkedin.com")) {
    statusDiv.innerText = "❌ Please navigate to a valid LinkedIn Profile page first!";
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }, (results) => {
    if (!results || !results[0] || !results[0].result) {
      statusDiv.innerText = "❌ Failed to read page data. Try refreshing LinkedIn.";
      return;
    }
    
    const scannedData = results[0].result;
    localStorage.setItem('scraped_profile_text', JSON.stringify(scannedData));
    
    document.getElementById('main-view').style.display = 'none';
    const paywallView = document.getElementById('paywall-view');
    paywallView.style.display = 'block';
    
    const upiString = `upi://pay?pa=${FATHER_UPI_ID}&pn=Pratim%20Baruah&am=299&cu=INR&tn=LinkedIn%20Profile%20AI%20Audit`;
    const qrContainer = document.getElementById('qr-container');
    qrContainer.innerHTML = `<img src="https://qrserver.com{encodeURIComponent(upiString)}" alt="UPI QR">`;
  });
});

document.getElementById('verify-btn').addEventListener('click', () => {
  const utr = document.getElementById('utr-input').value.trim();
  if (utr.length < 4) {
    alert("Please input a valid Transaction ID / UTR reference.");
    return;
  }
  
  document.getElementById('paywall-view').style.display = 'none';
  const outputView = document.getElementById('output-view');
  outputView.style.display = 'block';
  
  runGeminiPipeline();
});

async function runGeminiPipeline() {
  const profileRawData = JSON.parse(localStorage.getItem('scraped_profile_text'));
  const outputTextArea = document.getElementById('output-text');
  outputTextArea.value = "Processing AI Optimization pipeline... Please hold on.";
  
  const prompt = `You are an elite LinkedIn Branding Executive. Optimize this raw profile content. Fix standard AI clichés. Output clear, high-impact copy.
  Name: ${profileRawData.name}
  Headline: ${profileRawData.headline}
  About Section: ${profileRawData.about}
  Provide an optimized Headline (under 220 chars) and a high-converting 'About' biography section broken down into an attractive Hook, Value Statement, and Call to Action. Do not include markdown ticks or meta-commentary, just the optimized text layout.`;

  try {
    const response = await fetch(`https://googleapis.com{GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const json = await response.json();
    const generatedText = json.candidates[0].content.parts[0].text;
    outputTextArea.value = generatedText;
  } catch (err) {
    outputTextArea.value = "System processing exception pipeline routing error. Manual verification fallback active.";
    console.error(err);
  }
}

document.getElementById('copy-btn').addEventListener('click', () => {
  const text = document.getElementById('output-text');
  text.select();
  document.execCommand('copy');
  alert("Optimized profile text copied to clipboard!");
});
