function modal (message, actionFn, actionName) {
  let modalBody = `
    <div id="modal" class="modal">
      <div class="modal-content">
        <div class="modal-body">
          <h5 class="modal-message">${message}</h5>
        </div>
        <div class="modal-footer">
          <a id="modal-btn-close" href="#!" class="button">Close</a>
          <a id="modal-btn-action" href="#!" class="button">${actionName}</a>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalBody);
  let UImodal = document.querySelector('#modal');
  let UImodalBtnClose = document.querySelector('#modal-btn-close');
  let UImodalBtnAction = document.querySelector('#modal-btn-action');
  UImodalBtnClose.addEventListener('click', function() {UImodal.remove()});
  UImodalBtnAction.addEventListener('click', function() {
    UImodal.remove();
    actionFn();
  });
};

document.querySelector('#modal-trigger').addEventListener('click', function () {
  modal('Lorem ipsum, dolor sit amet consectetur adipisicing.', () => console.log('Message from modal fn'), 'Console message');
});

 