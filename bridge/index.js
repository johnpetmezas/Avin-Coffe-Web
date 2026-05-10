const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

/**
 * AVIN Unified Ecosystem - POS Bridge
 * This script polls the cloud server for new orders and triggers the local POS.
 */

const CONFIG = {
  SERVER_URL: 'https://your-vercel-domain.vercel.app', // Update with your Vercel URL
  POLL_INTERVAL: 5000, // 5 seconds
  BRIDGE_SECRET: 'YOUR_POS_BRIDGE_SECRET', // Must match Vercel env
  PRINT_MODE: 'LOG', // Options: 'LOG', 'FILE', 'SIMPLY_POS_API'
  FILE_PATH: './receipts'
};

async function pollOrders() {
  try {
    const response = await fetch(`${CONFIG.SERVER_URL}/api/pos/poll`, {
      headers: {
        'Authorization': `Bearer ${CONFIG.BRIDGE_SECRET}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) console.error('Authentication Failed: Check BRIDGE_SECRET');
      return;
    }

    const data = await response.json();
    
    if (data.jobs && data.jobs.length > 0) {
      for (const order of data.jobs) {
        console.log(`\n[NEW ORDER RECEIVED] ID: ${order.id}`);
        processOrder(order);
      }
    }
  } catch (error) {
    console.error('Polling Error:', error.message);
  }
}

function processOrder(order) {
  const receipt = formatReceipt(order);
  
  if (CONFIG.PRINT_MODE === 'LOG') {
    console.log('--- RECEIPT PREVIEW ---');
    console.log(receipt);
    console.log('-----------------------');
  } else if (CONFIG.PRINT_MODE === 'FILE') {
    const filename = `order_${order.id}_${Date.now()}.txt`;
    if (!fs.existsSync(CONFIG.FILE_PATH)) fs.mkdirSync(CONFIG.FILE_PATH);
    fs.writeFileSync(path.join(CONFIG.FILE_PATH, filename), receipt);
    console.log(`Saved receipt to ${filename}`);
  }
  
  // Example for Simply POS integration if they have a local listener
  // triggerSimplyPOS(order);
}

function formatReceipt(order) {
  let text = `AVIN SOLOMOS - RECEIPT\n`;
  text += `--------------------------\n`;
  text += `Order ID: ${order.id}\n`;
  text += `Customer: ${order.customerName}\n`;
  text += `Arrival: ${order.arrivalTime}\n`;
  text += `Date: ${new Date().toLocaleString('el-GR')}\n`;
  text += `--------------------------\n`;
  
  order.items.forEach(item => {
    text += `${item.qty}x ${item.name}\n`;
    text += `   - Sugar: ${item.sugar}\n`;
    if (item.notes) text += `   - Notes: ${item.notes}\n`;
  });
  
  text += `--------------------------\n`;
  text += `TOTAL: EUR ${order.total.toFixed(2)}\n`;
  if (order.notes) text += `\nCustomer Notes: ${order.notes}\n`;
  text += `--------------------------\n`;
  text += `Thank you!\n`;
  
  return text;
}

console.log('AVIN POS Bridge Started...');
console.log(`Polling ${CONFIG.SERVER_URL} every ${CONFIG.POLL_INTERVAL/1000}s`);
setInterval(pollOrders, CONFIG.POLL_INTERVAL);
pollOrders();
