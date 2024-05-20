<?php

class Modal {
    private $header;
    private $body;
    private $buttons;

    public function __construct($header = '', $body = '', $buttons = []) {
        $this->header = $header;
        $this->body = $body;
        $this->buttons = $buttons;
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
        echo '<div class="modal" id="genericModal">';
        echo '  <div class="modal-content">';
        echo '      <span class="close-btn" id="closeModal">&times;</span>';
        echo '      <div id="modalHeader" class="modal-header">' . $this->header . '</div>';
        echo '      <div id="modalBody" class="modal-body">' . $this->body . '</div>';
        echo '      <div id="modalFooter" class="modal-footer">';

        foreach ($this->buttons as $button) {
            echo '      <button class="' . $button['class'] . '" onclick="' . $button['onclick'] . '">' . $button['text'] . '</button>';
        }

        echo '      </div>';
        echo '  </div>';
        echo '</div>';
    }

    public static function setDbConnectionErrorModal() {
        $modal = new self(
            'Database Connection Failed',
            'Unable to connect to the database. Please check your root username, password, and hostname',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'retryInstaller()'],
                ['text' => 'Change Settings', 'progressButton' => 'settings-button', 'onclick' => 'changeDbSettings()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showFilePermissionErrorModal() {
        $modal = new self(
            'File Permission Error',
            'Failed to copy course files. Please run the following command: <code>chmod -R 755 /LenaSys/install/courses</code>',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'retryInstaller()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showDbCreationErrorModal() {
        $modal = new self(
            'Database Creation Failed',
            'Failed to create the database or database user. Please ensure you have the necessary permissions.',
            [
                ['text' => 'Force Create', 'class' => 'progressButton', 'onclick' => 'forceCreateDb()'],
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'retryInstaller()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showSqlExecutionErrorModal() {
        $modal = new self(
            'SQL Execution Failed',
            'An error occurred while executing SQL files. Please check the SQL syntax and try again.',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'retryInstaller()'],
                ['text' => 'Restart Installer', 'progressButton' => 'restart-button', 'onclick' => 'restartInstaller()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'closeModal()']
            ]
        );

        $modal->render();
    }
}