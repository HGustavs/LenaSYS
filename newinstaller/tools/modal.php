<?php

class Modal {
    private $id;
    private $header;
    private $body;
    private $buttons;

    public function __construct($id = '', $header = '', $body = '', $buttons = []) {
        $this->id = $id;
        $this->header = $header;
        $this->body = $body;
        $this->buttons = $buttons;
    }

    public function setID($id) {
        $this->id = $id;
    }

    public function setHeader($header) {
        $this->header = $header;
    }

    public function setBody($body) {
        $this->body = $body;
    }

    public function setButtons($buttons) {
        $this->buttons = $buttons;
    }

    public function render() {
        echo '<div class="modal" id="' . $this->id . '">';
        echo '  <div class="modal-content">';
        echo '      <span class="close-btn" id="closeModal">&times;</span>';
        echo '      <div id="modalHeader" class="modal-header">' . $this->header . '</div>';
        echo '      <div id="modalBody" class="modal-body">';
        echo            $this->body;
        echo '          <details>';
        echo '              <summary>Show previous entered</summary>';
        echo '              <div class="summary-content"></div>';
        echo '          </details>';
        echo '      </div>';
        echo '      <div id="modalFooter" class="modal-footer">';

        foreach ($this->buttons as $button) {
            echo '      <button class="' . $button['class'] . '" onclick="' . $button['onclick'] . '">' . $button['text'] . '</button>';
        }

        echo '      </div>';
        echo '  </div>';
        echo '</div>';
    }

    public static function setDbConnectionErrorModal($id) {
        $modal = new self(
            $id,
            'Database Connection Failed',
            '
                Unable to connect to the database. Please check your root username, password, and hostname.
                Press the retry-button if you want to return to the installer at the step where it failed or 
                change settings root user credentials and hostname here:

                <div>
                    <div class="input-grid">
                        <div class="input-field">
                            <label for="changeRootUsername">Root username:</label>
                            <input id="changeRootUsername" type="text"">
                        </div>

                        <div class="input-field">
                            <label for="changeRootPassword">Root password:</label>
                            <input id="changeRootPassword" type="password">
                        </div>

                        <div class="input-field">
                            <label for="changeHostname">Hostname:</label>
                            <input id="changeHostname" type="text">
                        </div>
                    </div>
                </div> 
            ',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'Window.retryInstaller()'],
                ['text' => 'Change Settings', 'class' => 'progressButton', 'onclick' => 'Window.changeDbSettings()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'Window.closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showFilePermissionErrorModal($id) {
        $modal = new self(
            $id,
            'File Permission Error',
            '
                Failed to copy course files. Please run the following command to fix file permissions:
                <code>chmod -R 755 /path/to/your/LenaSYS/newinstaller/courses</code>
                Make sure to replace <code>/path/to/your/LenaSYS</code> with the actual path where LenaSYS is located.

                For example:
                <pre><code>chmod -R 755 /Applications/XAMPP/xamppfiles/htdocs/LenaSYS/newinstaller/courses</code></pre>

                Press the retry-button if you want to return to the installer at the step where it failed.
            ',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'Window.retryInstaller()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'Window.closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showDbCreationErrorModal($id) {
        $modal = new self(
            $id,
            'Database Creation Failed',
            '
                Failed to create the database or database user. Please ensure you have the necessary permissions. 
                Press the force-button if you want overwrite database and database user or 
                press the retry-button if you want to return to the installer at the step where it failed.
            ',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'Window.retryInstaller()'],
                ['text' => 'Force', 'class' => 'progressButton', 'onclick' => 'Window.forceCreateDb()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'Window.closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showSqlExecutionErrorModal($id) {
        $modal = new self(
            $id,
            'SQL Execution Failed',
            '
                An error occurred while executing SQL files. Please check the SQL syntax and try again.
                Press the retry-button if you want to return to the installer at the step where it failed or 
                press the restart installer-button to restart installer and reset all values.
            ',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'Window.retryInstaller()'],
                ['text' => 'Restart Installer', 'class' => 'progressButton', 'onclick' => 'Window.restartInstaller()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'Window.closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showOperationErrorModal($id) {
        $modal = new self(
            $id,
            'Operation Failed',
            '<div id="failedStep"></div>',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'Window.retryInstaller()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'Window.closeModal()']
            ]
        );

        $modal->render();
    }
}