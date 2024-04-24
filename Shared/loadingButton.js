class LoadingButton {
    constructor(label, onClick) {
        this.label = label;
        this.onClick = onClick;
        this.isLoading = false;
        this.buttonElement = null;
    }

    // Method to render the button
    render(containerId) {
        const container = document.getElementById(containerId);
        this.buttonElement = document.createElement('button');
        this.buttonElement.classList.add('submit-button');
        this.buttonElement.style = 'float:right; margin-right:5px;';
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
        action: validateForm, // Function
        argument: "githubPopupWindow", // Argument to pass to the function
        buttonLabel: "Save Repo", // Button label
        containerId: "buttonContainerSaveRepo" // Container ID
      },
      saveCourse: {
        action: validateForm,
        argument: "editCourse",
        buttonLabel: "Save",
        containerId: "buttonContainerSaveCourse"
      }
      // Add more actions here as needed
    };
  
    // Loop through the actions and create a button for each, if the container exists
    Object.keys(actions).forEach((key) => {
      const { action, argument, buttonLabel, containerId } = actions[key];
      const container = document.getElementById(containerId);
      if (container) {
        const button = new LoadingButton(buttonLabel, (stopLoadingCallback) => {
          asyncActionRunner(action, argument, stopLoadingCallback);
        });
        button.render(containerId);
      }
    });
  });