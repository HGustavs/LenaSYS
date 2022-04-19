<!-- Created a new file containing a footer. It will be displayed on the front and within courses. There is a small icon at the bottom where it should be possible to click so it will be dark mode or light mode.-->
<?php

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <title>Document</title> -->
  </head>

  <style>
    #coursefooter{
      background: var(--color-primary);
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 22px;
    }

    #coursefooter img{
      max-width: 100%;
      /* height: inherit; */
      z-index: inherit;
      height: 40px;
      float: right;
      margin: -6px;
      cursor: pointer;
    }


  </style>

  <body>
    <!-- A footer that have a icon for dark/light mode -->
    <footer id="coursefooter">
      <img id="moon_toggle" src="../Shared/icons/Dark:lightmode_toggle.svg" alt="an icon on a moon, which indicates dark mode and light mood"/>
      <!-- oncklick="DarkLightMode_toggle();" -->
    </footer>
  </body>


</html>