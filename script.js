ocument.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const generateBtn = document.getElementById('generate-btn');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const strengthBars = document.querySelectorAll('.strength-bars .bar');

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Update length value display
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Generate password
    generateBtn.addEventListener('click', function() {
        const length = lengthSlider.value;
        const includeUppercase = uppercaseCheckbox.checked;
        const includeLowercase = lowercaseCheckbox.checked;
        const includeNumbers = numbersCheckbox.checked;
        const includeSymbols = symbolsCheckbox.checked;

        // Validate at least one character set is selected
        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
            showToast('Please select at least one character type');
            return;
        }

        let charset = '';
        if (includeUppercase) charset += uppercaseChars;
        if (includeLowercase) charset += lowercaseChars;
        if (includeNumbers) charset += numberChars;
        if (includeSymbols) charset += symbolChars;

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        passwordInput.value = password;
        updateStrengthMeter(password);
    });

    // Copy password to clipboard
    copyBtn.addEventListener('click', function() {
        if (!passwordInput.value) {
            showToast('No password to copy');
            return;
        }

        passwordInput.select();
        document.execCommand('copy');
        showToast('Password copied to clipboard!');
    });
    // Download password to files
    downloadBtn.addEventListener('click', function() {
        if (!passwordInput.value) {
            showToast('No password to download');
            return;
        }

        passwordInput.select();
        document.execCommand('download');
        showToast('Password downloaded to files!');
    });
     
    // Update password strength meter
    function updateStrengthMeter(password) {
        // Reset bars
        strengthBars.forEach(bar => {
            bar.className = 'bar';
        });

        if (!password) return;

        // Calculate strength (simple version)
        let strength = 0;
        
        // Length contributes to strength
        if (password.length >= 12) strength += 2;
        else if (password.length >= 8) strength += 1;
        
        // Character variety contributes to strength
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        
        const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
        strength += varietyCount;

        // Cap strength at 4 (for our 4 bars)
        strength = Math.min(strength, 4);

        // Apply strength classes
        for (let i = 0; i < strength; i++) {
            if (strength <= 2) {
                strengthBars[i].classList.add('weak');
            } else if (strength === 3) {
                strengthBars[i].classList.add('fair');
            } else {
                strengthBars[i].classList.add('strong');
            }
        }
    }

    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Generate a password on page load
    generateBtn.click();
});
