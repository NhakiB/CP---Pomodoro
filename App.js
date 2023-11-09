import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const App = () => {

  const tempoInicialTrabalho = 5;
  const tempoInicialDescanso = 1;

  const [tempoTrabalho, setTempoTrabalho] = useState(tempoInicialTrabalho);
  const [tempoDescanso, setTempoDescanso] = useState(tempoInicialDescanso);
  const [tempoAtual, setTempoAtual] = useState(tempoTrabalho * 60);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [emTrabalho, setEmTrabalho] = useState(true);

  useEffect(() => {
    let intervalo;

    if (timerAtivo) {
      intervalo = setInterval(() => {
        setTempoAtual((tempoAtual) => {
          const novoTempo = tempoAtual - 1;
          if (novoTempo <= 0) {
            clearInterval(intervalo);
            setEmTrabalho(!emTrabalho);
            return emTrabalho ? tempoDescanso * 60 : tempoTrabalho * 60;
          }
          return novoTempo;
        });
      }, 1000);
    } else {
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo);
  }, [timerAtivo, emTrabalho, tempoTrabalho, tempoDescanso]);

  const mudarTempo = (minutos, tipo) => {
    if (!timerAtivo) {
      if (tipo === 'trabalho') {
        const novoTempo = Math.max(tempoTrabalho + minutos, 1);
        setTempoTrabalho(novoTempo);
        if (emTrabalho) setTempoAtual(novoTempo * 60);
      } else {
        const novoTempo = Math.max(tempoDescanso + minutos, 1);
        setTempoDescanso(novoTempo);
        if (!emTrabalho) setTempoAtual(novoTempo * 60);
      }
    }
  };

  const formatarTempo = (tempo) => {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: emTrabalho ? '#f84434' : '#00b383' },
      ]}
    >
      <Text style={styles.titulo}>
        {emTrabalho ? 'Hora de trabalhar' : 'Hora de descansar'}
      </Text>

      <Text style={styles.timer}>{formatarTempo(tempoAtual)}</Text>

      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => setTimerAtivo(!timerAtivo)}
        >
          <Text style={styles.botaoTexto}>{timerAtivo ? 'Parar' : 'Iniciar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            setTimerAtivo(false);
            setTempoAtual(emTrabalho ? tempoTrabalho * 60 : tempoDescanso * 60);
          }}
        >
          <Text style={styles.botaoTexto}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.configuracao}>
        <View style={styles.configuracaoBloco}>
          <Text style={styles.configuracaoTitulo}>Trabalho</Text>
          <View style={styles.configuracaoBotoes}>
            <TouchableOpacity
              style={styles.botaoConfiguracao}
              onPress={() => mudarTempo(1, 'trabalho')}
              disabled={emTrabalho && timerAtivo}
            >
              <Text style={styles.configuracaoBotaoTexto}>+</Text>
            </TouchableOpacity>
            <Text style={styles.configuracaoValor}>{tempoTrabalho}</Text>
            <TouchableOpacity
              style={styles.botaoConfiguracao}
              onPress={() => mudarTempo(-1, 'trabalho')}
              disabled={emTrabalho && timerAtivo || tempoTrabalho <= 1}
            >
              <Text style={styles.configuracaoBotaoTexto}>-</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.configuracaoBloco}>
          <Text style={styles.configuracaoTitulo}>Descanso</Text>
          <View style={styles.configuracaoBotoes}>
            <TouchableOpacity
              style={styles.botaoConfiguracao}
              onPress={() => mudarTempo(1, 'descanso')}
              disabled={!emTrabalho && timerAtivo}
            >
              <Text style={styles.configuracaoBotaoTexto}>+</Text>
            </TouchableOpacity>
            <Text style={styles.configuracaoValor}>{tempoDescanso}</Text>
            <TouchableOpacity
              style={styles.botaoConfiguracao}
              onPress={() => mudarTempo(-1, 'descanso')}
              disabled={!emTrabalho && timerAtivo || tempoDescanso <= 1}
            >
              <Text style={styles.configuracaoBotaoTexto}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  botoes: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  botao: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  botaoTexto: {
    fontSize: 20,
  },
  configuracao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  configuracaoBloco: {
    alignItems: 'center',
  },
  configuracaoTitulo: {
    fontSize: 18,
    marginBottom: 10,
  },
  botaoConfiguracao: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
  },
  configuracaoBotaoTexto: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  configuracaoBotoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  configuracaoValor: {
    fontSize: 20,
    marginHorizontal: 10,
  }
});

export default App;