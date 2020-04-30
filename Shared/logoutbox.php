<!-- Overlay -->
<div id="overlay" style="display: none;"></div>
<div id='logoutBox' class="logoutBoxContainer" style="display: none;">
	<div id='logout' class="logoutBox">
		<div class='logoutBoxheader'>
			<h3>Sign out</h3>
			<div class="cursorPointer" onclick="closeWindows();" title="Close window">x</div>
		</div>
		<form action="" id="logoutForm" method="post">
			<div>
				<p>Are you sure you want to log out?</p>
			</div>
			<table class="logoutBoxTable">
				<tr class="logoutboxTr">
					<td>
						<input type='button' class='buttonLogoutBox' onclick='processLogout();' value='Log out' title='Log out'>
					</td>
					<td>
						<input type='button' class='buttonLogoutBox buttonLogoutCancelBox' onclick='closeWindows();' value='Cancel' title='CancelLogout'>
					</td>						
				</tr>
			</table>
		</form>
	</div>
</div>

		
