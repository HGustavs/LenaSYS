<?php session_start(); ?>

<?php if($_SESSION['user']['permission'] == 2) { ?>
    <table class="list">
        <tr>
            <th>Student ID</th>
            <th>Dugga ID</th>
            <th>Dugga Variant</th>
            <th>Start</th>
            <th>Deadline</th>
            <th>Betyg</th>
            <th>Svar</th>
            <th>Se dugga</th>
        </tr>
        <tr>
            <td>a11erias</td>
            <td>1</td>
            <td>3</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>a=1, c=3</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
        <tr>
            <td>a11erias</td>
            <td>1</td>
            <td>3</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>a=1, c=3</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
        <tr class="red">
            <td>b12erifr</td>
            <td>1</td>
            <td>3</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>b=2, c=3</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
        <tr class="red">
            <td>b12erifr</td>
            <td>1</td>
            <td>3</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>b=2, c=3</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
        <tr class="red">
            <td>b12erifr</td>
            <td>1</td>
            <td>3</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>b=2, c=3</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
        <tr class="green">
            <td>b12davas</td>
            <td>1</td>
            <td>1</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>a=Zlatan</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
        <tr class="green">
            <td>b12davas</td>
            <td>1</td>
            <td>1</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>a=Zlatan</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
        <tr class="green">
            <td>b12davas</td>
            <td>1</td>
            <td>1</td>
            <td>2014-04-16 23:00</td>
            <td>2014-04-16 23:00</td>
            <td>
            <select>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='u'>U</option>
            </select>
            <td>a=Zlatan</td>
            <td><a href="#">Gå till dugga</a></td>
        </tr>
    </table>
<?php }else {?>
    <script type="text/javascript">
        changeURL('noid');
    </script>
<?php } ?>