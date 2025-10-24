// Define the options for dropdowns
const dropdownOptions = {
    building_type: ['Apartment', 'Shop', 'Floor', 'Office', 'Residential Plot',
        'Duplex', 'Building', 'Commercial Plot', 'Warehouse', 'Factory',
        'House', 'Others'],
    building_nature: ['Residential', 'Commercial'],
    purpose: ['Sale', 'Rent'],
    locality: ['Adabor', 'Agargaon', 'Airport', 'Aftab Nagar', 'Banani', 'Banani Dohs',
        'Banglamotors', 'Bangshal', 'Banasree', 'Badda', 'Baridhara',
        'Baridhara Dohs', 'Bashabo', 'Bashundhara', 'Bashundhara R\\A',
        'Cantonment', 'Chack Bazar', 'Dakshin Khan', 'Demra', 'DOHS Banani',
        'DOHS Baridhara', 'DOHS Mirpur', 'DOHS Mohakhali', 'Dhanmondi', 'Dumni',
        'Eskaton', 'Farmgate', 'Gandaria ', 'Gulistan', 'Gulshan',
        'Gulshan 1', 'Gulshan 2', 'Hatirpool', 'Hazaribag', 'Hazaribag ',
        'Ibrahimpur', 'Jatra Bari', 'Joar Sahara', 'Kachukhet', 'Kadamtali',
        'Kafrul', 'Kakrail', 'Kalabagan', 'Kalachandpur', 'Kallaynpur',
        'Kamrangir Char', 'Karwan Bazar', 'Kathalbagan', 'Keraniganj',
        'Khilgaon', 'Khilkhet', 'Kotwali', 'Kuril', 'Lalbag', 'Lalbagh',
        'Lalmatia', 'Maghbazar', 'Malibagh', 'Maniknagar', 'Mirpur',
        'Mohakhali', 'Mohakhali Dohs', 'Mohammadpur', 'Mohammadpur ',
        'Moghbazar', 'Motijheel', 'Mugdapara', 'New Market', 'Niketan',
        'Nikunja', 'Nadda', 'North Shahjahanpur', 'Paribagh', 'Paltan',
        'Pallabi ', 'Purbachal', 'Rampura', 'Ramna', 'Rupnagar', 'Sabujbag',
        'Savar', 'Senpara Porbota', 'Shah Ali', 'Shahbag ', 'Shahjahanpur',
        'Shantinagar', 'Sher E Bangla Nagar ', 'Shegunbagicha', 'Shiddheswari',
        'Shyamoli', 'Shyampur', 'Shyampur ', 'Siddeshwari', 'Sutrapur',
        'Taltola', 'Tejgaon', 'Tejgaon I/A', 'Tongi', 'Turag', 'Uttar Khan',
        'Uttara', 'Uttara East', 'Uttara West', 'Vatara ', 'Wari',
        'Zafrabad'],
    zone: ['Badda', 'Banani', 'Bashundhara R/A', 'Dakshin Khan', 'Demra',
            'Dhaka Cantonment', 'Dhanmondi', 'Golapbag', 'Gulshan', 'Hatirpool',
            'Hazaribagh', 'Jatrabari', 'Keraniganj', 'Khilgaon', 'Khilkhet',
            'Kurmitola', 'Mirpur', 'Mohakhali', 'Mohammadpur', 'Motijheel',
            'Mugdapara', 'New Market', 'Old Dhaka', 'Purbachal', 'Ramna', 'Savar',
            'Shabujbag', 'Sher-E-Bangla Nagar', 'Shyamoli', 'Sub-district of Dhaka',
            'Sub-district of Gazipur', 'Sutrapur', 'Turag', 'Uttara']
};

// Populate dropdowns on page load
document.addEventListener('DOMContentLoaded', function() {
    // Populate all dropdowns
    Object.keys(dropdownOptions).forEach(key => {
        const select = document.getElementById(key);
        dropdownOptions[key].forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
    });

    // Function to validate numeric input
    function validateNumericInput(input) {
        const value = parseFloat(input.value);
        if (value < 0) {
            input.value = 0;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    }

    // Add input validation for all numeric fields
    const numericInputs = [
        'area', 'num_bed_rooms', 'num_bath_rooms'
    ];

    numericInputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', () => validateNumericInput(input));
        input.addEventListener('paste', (e) => {
            setTimeout(() => validateNumericInput(input), 0);
        });
    });

    // Add form submit handler
    document.getElementById('predictionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Additional validation before submission
        let isValid = true;
        numericInputs.forEach(id => {
            const input = document.getElementById(id);
            const value = parseFloat(input.value);
            if (value < 0) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }
        
        // Collect form data
        const formData = {
            area: document.getElementById('area').value,
            building_type: document.getElementById('building_type').value,
            building_nature: document.getElementById('building_nature').value,
            num_bath_rooms: document.getElementById('num_bath_rooms').value,
            num_bed_rooms: document.getElementById('num_bed_rooms').value,
            purpose: document.getElementById('purpose').value,
            locality: document.getElementById('locality').value,
            zone: document.getElementById('zone').value
        };

        try {
            // Send prediction request
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (response.ok) {
                // Show prediction
                document.getElementById('result').style.display = 'block';
                document.getElementById('predicted-price').textContent = 
                    `৳ ${result.prediction.toLocaleString()}`;
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error making prediction: ' + error.message);
        }
    });
});