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
        echo '      <div id="modalBody" class="modal-body">' . $this->body . '</div>';
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
            'Unable to connect to the database. Please check your root username, password, and hostname',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'retryInstaller()'],
                ['text' => 'Change Settings', 'progressButton' => 'settings-button', 'onclick' => 'changeDbSettings()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showFilePermissionErrorModal($id) {
        $modal = new self(
            $id,
            'File Permission Error',
            'Failed to copy course files. Please run the following command: <code>chmod -R 755 /LenaSys/install/courses</code>',
            [
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'retryInstaller()'],
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'closeModal()']
            ]
        );

        $modal->render();
    }

    public static function showDbCreationErrorModal($id) {
        $modal = new self(
            $id,
            'Database Creation Failed',
            'Failed to create the database or database user. Please ensure you have the necessary permissions.',
            [
                ['text' => 'Cancel', 'class' => 'backButton', 'onclick' => 'closeModal()'],
                ['text' => 'Retry', 'class' => 'progressButton', 'onclick' => 'retryInstaller()'],
                ['text' => 'Force', 'class' => 'progressButton', 'onclick' => 'forceCreateDb('.$id.')']
            ]
        );

        $modal->render();
    }

    public static function showSqlExecutionErrorModal($id) {
        $modal = new self(
            $id,
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