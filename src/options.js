

// Saves options to chrome.storage
function save_options() {
  const key = document.getElementById('mailchimp-api').value;
  chrome.storage.sync.set({
    mailchimpApi: key,
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    mailchimpApi: '',
  }, function(items) {
    document.getElementById('mailchimp-api').value = items.mailchimpApi;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);