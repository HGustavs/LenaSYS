<?php
	function navigationButtons($previousPage, $nextPage) {
		echo "<div class='buttonContainer'>";
		echo "	<button class='backButton page-nav' data-target='{$previousPage}' onclick=''>Previous</button>";
		echo "	<button class='progressButton page-nav' data-target='{$nextPage}' onclick=''>Next</button>";
		echo "</div>";
	}

	function singleNavigationButton($nextSequence, $targetPage) {
		echo "<div class='buttonContainer'>";

		if (strtolower($nextSequence) !== "next") {
			echo "<button class='backButton page-nav' data-target='{$targetPage}'>Previous</button>";
		} else {
			echo "<button class='progressButton page-nav' data-target='{$targetPage}'>Next</button>";
		}

		echo "</div>";
	}

	function defaultButton($title, $class = "", $onclick = "") {
		echo "<button class='defaultButton $class' onclick={$onclick}>{$title}</button>";
	}
	
	function breadcrumb(int $n, int $active) {
		echo "<div>";
		echo "<ul class='breadcrumbs'>";

		for ($i = 1; $i < $n+1; $i++) {
			$current_active = $i == $active ? "breadcrumb-selected" : "";
			echo "<li class='breadcrumb {$current_active}'>Step {$i}</li>";
			if ($i != $n) {
				echo "<span class='arrow_icon'>&gt;</span>";
			}
		}

		echo "</ul>";
		echo "</div>\n";
	}

	function header2($header2Text) {
		echo "<div>
			<h2 class='header-2'>".$header2Text."</h2>
			</div>";
	}

	function bodyText($bodyText, $helpLink = null) {
		echo "<p class='body-text'>{$bodyText}";

		if (isset($helpLink)) {
			helpTool($helpLink);
		}

		echo "</p>";
	}

	function progressBar() {
		echo "<div class='progressBar'>
				<div class='progressBarLabels'>
					<label></label>
					<label>0%</label>
				</div>
				<div class='progressBarBorder'>
					<div class='progressBarIndicator'></div>
				</div>
			</div>";
	}

	function inputField($inputId, $inputLabel, $inputType, $inputValue='') {
		echo "<div class='input-field'>
					<label for='$inputId'>$inputLabel</label>
					<input id='$inputId' name='$inputId' type='$inputType' value='". htmlspecialchars($inputValue) ."'>
			</div>";
	}

	function inputFieldWithTip($inputId, $inputLabel, $tipText) {
		echo "<div class='input-field'>
					<label for='$inputId'>$inputLabel</label>
					<input id='$inputId' type='text'>
					<p class='tip'>$tipText</p>
			</div>";
	}

	function inputFieldAccText($inputId, $inputLabel, $accClass, $accText) {
		echo "<div class='input-field'>
					<label for='$inputId'>$inputLabel</label>
					<input id='$inputId' type='text'>              
					<p class='$accClass'>".$accText."</p>        
			</div>";
	}

	function radioButtons($radioGroupName, $buttons, $checkedId = null) {
		echo "<div class='grid-element-span'>";
		foreach ($buttons as $id => $label) {
			$checked = ($id === $checkedId) ? "checked" : "";
			echo "<div class='radiobutton'>
					<input id='$id' type='radio' name='$radioGroupName' value='$id' $checked>
					<label for='$id'>$label</label>
				</div>";
		}
		echo "</div>";
	}

	function checkbox($checkboxId, $checkboxText, $helpLink = null) {
		echo "<div class='checkbox'>";
		echo "    <input id='$checkboxId' type='checkbox' value='$checkboxId'>";
		echo "    <label for='$checkboxId'>$checkboxText";
	
		if (isset($helpLink)) {
			helpTool($helpLink);
		}
	
		echo "    </label>";
		echo "</div>";
	}

	function checkboxWithWarning($checkboxId, $checkboxText, $warningText, $helpLink = null) {
	  echo "<div class='checkboxWithWarning'>";
		echo "    <div class='checkbox'>";
		echo "        <input id='$checkboxId' type='checkbox'>";
		echo "        <label for='$checkboxId'>$checkboxText";

		if (isset($helpLink)) {
			helpTool($helpLink);
		}

		echo "        </label>";
		echo "    </div>";
		echo "    <p class='warning'>$warningText</p>";
		echo "</div>";
	}

	function checkBoxes($checkboxGroupName, $checkboxes, $checkedIds = [], $helpLinks = []) {
		echo "<div class='grid-element-span'>";
	
		foreach ($checkboxes as $id => $label) {
			$checked = in_array($id, $checkedIds) ? "checked" : "";
			echo "<div class='checkbox'>";
			echo "   <input id='$id' type='checkbox' name='{$checkboxGroupName}[]' $checked>";
			echo "   <label for='$id'>$label";

			if (isset($helpLinks[$id])) {
				echo "  <a href='{$helpLinks[$id]}' target='_blank'>";
				echo "      <span class='material-symbols-outlined help-icon'>help</span>";
				echo "  </a>";
			}

			echo "   </label>";
			echo "</div>";
		}
		echo "</div>";
	}

	function checkBoxesWithColumns($checkboxGroupName, $checkboxes, $checkedIds = []) {
		echo "<div class='input-sub-grid'>";
		foreach ($checkboxes as $id => $label) {
			$checked = in_array($id, $checkedIds) ? "checked" : "";
			echo "<div class='checkbox'>
					<input id='$id' type='checkbox' name='{$checkboxGroupName}[]' $checked>
					<label for='$id'>$label</label>
				  </div>";
		}
		echo "</div>";
	}

	function displayStackTrace($statusMessages) {
		echo "<div class='trace'>";
		echo "<a href='#' class='toggleTrace'>View more</a>";
		echo "<div class='stacktrace'>";
		foreach ($statusMessages as $message) {
			echo "<p>" . htmlspecialchars($message) . "</p>";
		}
		echo "</div>";
		echo "</div>";
	}

	function helpTool($link) {
		echo "  <a href='{$link}' target='_blank'>";
		echo "      <span class='material-symbols-outlined help-icon'>help</span>";
		echo "  </a>";
	}