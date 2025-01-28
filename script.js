document.getElementById('submit').addEventListener('click', () => {
    const links = document.getElementById('links').value.split('\n');
    const option = document.getElementById('options').value;

    if (links.length === 0 || !option) {
        alert('Please provide links and select an option.');
        return;
    }

    alert(`Links saved for ${option}: \n${links.join('\n')}`);
    // Logic to send these links to your bot server can go here.
});
