<?php
    $value1 = null;
    $value2 = null;
    function button($value1,$value2) {
        echo "<div class='buttonContainer'>";
        echo "<button class='backButton' onclick='breadCrumbDecr(); breadCrumbActive();'>".$value1."</button>";
        echo "<button class='progressButton' onclick='breadCrumbInc(); breadCrumbActive();'>".$value2."</button>";
        echo "</div>";
    }

    function breadcrumb() {
        echo "<div>
                <ul class='breadcrumbs'>
                    <li id='bcStep1' class='breadcrumb breadcrumb-selected'>Step 1</li><span class='arrow_icon'>
                        &gt;
                        </span>
                    <li id='bcStep2' class='breadcrumb'>Step 2</li><span class='arrow_icon'>
                        &gt;
                        </span>
                    <li id='bcStep3' class='breadcrumb'>Step 3</li><span class='arrow_icon'>
                        &gt;
                        </span>
                    <li id='bcStep4' class='breadcrumb'>Step 4</li><span class='arrow_icon'>
                        &gt;
                        </span>
                    <li id='bcStep5' class='breadcrumb'>Step 5</li><span class='arrow_icon'>
                        &gt;
                        </span>
                    <li id='bcStep6' class='breadcrumb'>Step 6</li>
                </ul>
            </div>";
    }

    function header2($header2Text) {
        echo "<div>
            <h2 class='header-2'>".$header2Text."</h2>
            </div>";
    }

    function bodyText($bodyText) {
        echo "<div class='body-text'>
            <p>".$bodyText."</p>
            </div>";
    }

    function progressBar() {
        echo "<div class='progressBar'>
                <div class='progressBarLabels'>
                    <label>lenasys/dugga...</label>
                    <label>15%</label>
                </div>
                <div class='progressBarBorder'>
                    <div class='progressBarIndicator'></div>
                </div>
            </div>";
    }

    function inputField($inputId, $inputLabel) {
        echo "<div class='input-field'>
                    <label for='$inputId'>$inputLabel</label>
                    <input id='$inputId' type='text'>
            </div>";
    }

    function inputFieldAccText($inputId, $inputLabel, $accClass, $accText) {
        echo "<div class='input-field'>
                    <label for='$inputId'>$inputLabel</label>
                    <input id='$inputId' type='text'>              
                    <p class='$accClass'>".$accText."</p>        
            </div>";
    }

    function checkBox($checkBoxId, $checkBoxText) {
        echo "<div class='checkbox'>
                <input id='$checkBoxId' type='checkbox'>
                <label for='$checkBoxId'>".$checkBoxText."</label>
            </div>";
    }
    function checkBoxAccText($checkBoxId, $checkBoxText, $accClass, $accText) {
        echo "<div class='checkbox'>
                <input id='$checkBoxId' type='checkbox'>
                <label for='$checkBoxId'>".$checkBoxText."</label>
                </div>
                <p class='$accClass'>".$accText."</p>";
    }
?>