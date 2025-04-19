import React from "react";

function Header() {
  return (
    <div className="about">
      <div className="col-8 offset-2">
        <h3>Polymatic!</h3>
        <p>projeto idealizado por Gil Amancio e Guilherme Guerra</p>
        <p>
          O Polymatic é um aplicativo para fazer música ou dar aula de música a
          partir de outros paradigmas que orientam a criação musical. Ele é
          inspirado nos modos de produção da música africana e da diáspora. Não
          é um software para fazer música no computador, mas sim, um aplicativo
          para fazer música assistida por computador, ou seja, o computador é
          uma ferramenta para instigar a criação e a execução musical coletiva
          que acontece junto com o computador.
        </p>
        <p>
          O Polymatic é um aplicativo que gera padrões rítmicos mínimos. Esses
          padrões têm vários nomes em diferentes lugares, clave em Cuba,
          timeline nos Estados Unidos e Europa, e no Brasil resolvi chamá-los de
          Guia.
        </p>
        <p>
          A escolha do nome Guia veio da associação dos registros desses padrões
          rítmicos de forma circular, feito pelo músico Safi-alDin em Bagdá no
          ano de 1280, com as Guias usadas pelo povo dos terreiros.
        </p>
        <p>
          Do ponto de vista musical a guia é um ostinato, que se repete sem
          variação, ao longo de uma peça musical. Ela atua como um dispositivo
          estruturador da criação musical, dá o tempero da levada e atua também
          como um cronômetro.
        </p>
        <p>
          Nos terreiros, a palavra guia também tem vários significados, ela pode
          se referir tanto ao colar utilizado pelas pessoas que frequentam o
          terreiro, como também as entidades que são chamadas de guias.
        </p>
        <p>
          Acredito que chamar de guia os padrões rítmicos gerados pelo
          Polymatic, vai nos aproximar do pensamento das culturas dos povos
          africanos e das diásporas e de suas experiências coletivas de fazer
          música. Uma música que não se separa da dança e da vida.
        </p>
        <p>
          Esperamos que o Polymatic possa possibilitar que você reúna a família,
          as/os amigos/as e se for professor as/os estudantes para juntos
          fazerem música a partir do pensamento musical africano e da diáspora.
        </p>

        <p>Mas como isso acontece? Leia o nosso manual.</p>

        <p>
          <a
            href={`${process.env.PUBLIC_URL}/manual.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Baixar manual
          </a>
        </p>
      </div>
    </div>
  );
}
export default Header;
