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
    }