const UIMyRangeSlider = document.querySelector('#my-range');
const UIMyRangeSliderLabel = document.querySelector('#my-range-label');

// Binding 
UIMyRangeSliderLabel.innerText = UIMyRangeSlider.value;
UIMyRangeSlider.oninput = function () {
  UIMyRangeSliderLabel.innerText = this.value;
}