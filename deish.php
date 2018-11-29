<form method="GET" action="consulta.php">
<?php 

			session_start();
            $server = 'localhost';
            $user = 'root';
            $pass = '';
            $bd_nome = 'palavras';

             $con = new mysqli($server, $user, $pass, $bd_nome);


             if ($con->connect_error) {
                die("Erro na Conexão: " . $con->connect_error);
            }
            
            $sql = "select DISTINCT tipo from palavra order by QntdLetras asc";

             $resposta = $con->query($sql);
            $linha = 0;
            $valor = 1;


echo "<table id=>";
            while ($row = $resposta->fetch_assoc()){
            	if ($linha == 0) {
            		echo "<tr>";
            	}
            		echo "<td>";
	                    echo '<label class="container">'.$row['nome'];	                    
	                    echo ' >';	                    
	                    echo '</label>';
                    echo "</td>";

                    //$linha == $linha + 1;
                    $linha += 1;
                    $valor += 1;

                if ($linha == 6) {
                	$linha = 0;
                	echo "</tr>";

                    echo "</table>";
                    <input type="submit" value="Selecionar" class="button">

</form>