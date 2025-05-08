class LoadingButton {
  constructor(label, onClick, style = 'float:right; margin-right:5px;', color = '', buttonId = '') {
    this.label = label;
    this.onClick = onClick;
    this.style = style;
    this.color = color;
    this.id = buttonId;
    this.isLoading = false;
    this.buttonElement = null;
  }

  // Method to render the button
  render(containerId) {
    const container = document.getElementById(containerId);
    this.buttonElement = document.createElement('button');
    this.buttonElement.classList.add('submit-button');
    this.buttonElement.style = this.style;
    this.buttonElement.style.backgroundColor = this.color;
    if (this.id !== '') this.buttonElement.id = this.id;
    this.buttonElement.textContent = this.label;
    this.buttonElement.onclick = () => this.handleOnClick();
    container.appendChild(this.buttonElement);
  }

  // Internal method to handle the click event
  handleOnClick() {
    if (this.isLoading) return; // Prevent clicks during loading
    this.isLoading = true;
    this.buttonElement.disabled = true;
    this.showLoadingSpinner();
    this.onClick(this.stopLoading.bind(this));
  }

  showLoadingSpinner() {
    console.log("Loading...");
    this.buttonElement.innerHTML = '';
    const spinner = document.createElement('div');
    spinner.classList.add('loader');
    this.buttonElement.appendChild(spinner);
  }

  // Method to stop the loading process
  stopLoading() {
    this.isLoading = false;
    this.buttonElement.disabled = false;
    this.buttonElement.innerHTML = this.label;
  }
}

function asyncActionRunner(action, actionArgument, stopLoadingCallback) {
  setTimeout(() => {    // setTimeout is used to simulate an async action
    action(actionArgument)
    stopLoadingCallback();
  }, 250);
}

document.addEventListener('DOMContentLoaded', () => {
  const actions = {
    saveRepo: {
      action: () => validateForm, // Function, () => is used to reference the function without calling it
      argument: "githubPopupWindow", // Argument to pass to the function
      buttonLabel: "Save Repo", // Button label
      containerId: "buttonContainerSaveRepo", // Container ID
      // style: 'float:right; margin-right:5px;', // Optional: Custom styling
      // color: 'Blue' // Optional: Custom color
      buttonId: "saveRepo" // Optional: Custom ID
    },
    saveCourse: {
      action: () => validateForm,
      argument: "editCourse",
      buttonLabel: "Save",
      containerId: "buttonContainerSaveCourse",
      buttonId: "saveCourse" 
    },
    deleteCourse: {
      action: () => openDeleteForm,
      argument: "",
      buttonLabel: "Delete",
      containerId: "buttonContainerDeleteCourse",
      style: 'float:left; margin-right:5px;',
      color: 'DarkRed'
    },
    submitEditCourse: {
      action: () => validateForm,
      argument: "editCourseVersion",
      buttonLabel: "Save",
      containerId: "ButtonContainerSubmitEditCourse",
      buttonId: "submitEditCourse"
    },
    createCourse: {
      action: () => validateForm,
      argument: "newCourse",
      buttonLabel: "Create",
      containerId: "buttonContainerCreateCourse",
      buttonId: "createCourse"
    }
    // Add more actions here as neededsubmitEditCourse
  };

  // Loop through the actions and create a button for each, if the container exists
  Object.keys(actions).forEach((key) => {
    const { action, argument, buttonLabel, containerId, style, color, buttonId } = actions[key];
    const container = document.getElementById(containerId);
    if (container) {
      const button = new LoadingButton(buttonLabel, (stopLoadingCallback) => {
        asyncActionRunner(action(), argument, stopLoadingCallback);
      }, style, color, buttonId);
      button.render(containerId);
    }
  });
});