<!-- Overlay -->
<link rel="stylesheet" type="text/css" href="css/style.css">
<div id="overlay" style="display: none;"></div>

<div id='logoutBox' class="logoutBoxContainer" style="display: none;">
	<div id='logout' class="logoutBox">
		<div class='logoutBoxheader'>
			<h3>Logout</h3>
			<div class="cursorPointer" onclick="closeWindows();" title="Close window">x</div>
		</div>
		<form action="" id="logoutForm" method="post">
			<div>
				<h3 id="logoutBoxTitle">Sign out</h3>
				<p><b>Are you sure you want to log out?</b></p>
			</div>
			<table class="logoutBoxTable">
				<tr class="logoutboxTr">
					<td>
						<input type='button' class='buttonLogoutBox' onclick="processLogout();" value='Logout' title='Logout'>
					</td>
					<td>
						<input type='button' class='buttonLogoutBox buttonLogoutCancelBox' onclick="closeWindows();" value='Cancel' title='CancelLogout'>
					</td>						
				</tr>
			</table>
		</form>
	</div>
</div>

		
