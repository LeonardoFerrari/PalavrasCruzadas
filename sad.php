<?php
$content = http_build_query(array(
    'field1' => 'Value1',
    'field2' => 'Value2',
    'field3' => 'Value3',
));
  
$context = stream_context_create(array(
    'http' => array(
        'method'  => 'POST',
        'content' => $content,
    )
));
  



$query = "INSERT INTO words(Palavra,Dica) VALUES ('".$context."','".$context."');";
if ( !( $database = mysqli_connect( "localhost", "bebeto", "lelito", "palavras" ) ) )
    die( "Could not connect to database </body></html>" );
$result = $database->query($query);

?>