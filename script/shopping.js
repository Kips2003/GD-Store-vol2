const priceToggle = document.querySelector('.price');
const categoryToggle = document.querySelector('.category');
const filters = document.querySelector('.filters');

categoryToggle.style.cursor = 'pointer';
priceToggle.style.cursor = 'pointer';

const div = document.createElement('div');


div.innerHTML = 
`<label for="min">min:</label>
<input type="text" name="min" id="min">
<label for="max">max:</label>
<input type="text" name="max" id="max">`;
div.classList.add = "price-toggle";

priceToggle.addEventListener('click', () => {
    
    filters.innerHTML += `<div class="price-toggle">
    <label for="min">min:</label>
    <input type="text" name="min" id="min">
    <label for="max">max:</label>
    <input type="text" name="max" id="max">
    <button type="submit>Submit</button>
</div>`;

    document.querySelector('.price-toggle').style.display = 'block';
})