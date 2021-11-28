// Saves options to chrome.storage
const saveOptions = () => {
  const key = document.getElementById('mailchimp-api').value;
  chrome.storage.sync.set({
    mailchimpApi: key,
  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    mailchimpApi: '',
  }, (items) => {
    document.getElementById('mailchimp-api').value = items.mailchimpApi;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
