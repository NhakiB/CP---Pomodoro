import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { MoveDown, MoveUp, Play, RotateCw, Square } from 'lucide-react-native';

const App = () => {
  const [tempoTrabalho, setTempoTrabalho] = useState(1 * 60); // Tempo de trabalho inicial: 25 minutos em segundos
  const [tempoDescanso, setTempoDescanso] = useState(1 * 60); // Tempo de descanso inicial: 5 minutos em segundos
  const [tempoRestante, setTempoRestante] = useState(tempoTrabalho);
  const [emTrabalho, setEmTrabalho] = useState(true);
  const [iniciar, setIniciar] = useState(false);
  const [key, setKey] = useState(0);

  const countdownRef = useRef(null);

  useEffect(() => {
    if (iniciar && tempoRestante > 0) {
      countdownRef.current = setInterval(() => {
        setTempoRestante(tempoRestante => tempoRestante - 1);
      }, 1000);
    } else if (iniciar && tempoRestante === 0) {
      if (emTrabalho) {
        setEmTrabalho(false);
        setTempoRestante(tempoDescanso);
      } else {
        setEmTrabalho(true);
        setTempoRestante(tempoTrabalho);
      }
    }

    return () => {
      clearInterval(countdownRef.current);
    };
  }, [iniciar, tempoRestante, emTrabalho, tempoTrabalho, tempoDescanso]);

  const handleIniciarParar = () => {
    setIniciar(!iniciar);
    setEmTrabalho(!emTrabalho);
  };

  const handleReiniciar = () => {
    setTempoRestante(emTrabalho ? tempoTrabalho : tempoDescanso);
  };

  const handleAlterarTempo = (tipo, operacao) => {
    if (tipo === 'trabalho' && operacao === 1) {
      setTempoTrabalho(tempoTrabalho + 60);
      setTempoRestante(tempoRestante + 60);
    } else if (tipo === 'trabalho' && operacao === -1 && tempoTrabalho > 60) {
      setTempoTrabalho(tempoTrabalho - 60);
      setTempoRestante(tempoRestante - 60);
    } else if (tipo === 'descanso' && operacao === 1) {
      setTempoDescanso(tempoDescanso + 60);
      setTempoRestante(tempoRestante + 60);
    } else if (tipo === 'descanso' && operacao === -1 && tempoDescanso > 60) {
      setTempoDescanso(tempoDescanso - 60);
      setTempoRestante(tempoRestante - 60);
    }
  };

  return (
    <>
      <View style={styles.tela}>
        <Text style={styles.titulo}>
          Hora de {emTrabalho ? 'Trabalho' : 'Descanso'}
        </Text>
        
        <View style={styles.secaoBotoes}>
          <TouchableOpacity
            style={styles.botaoCronometro}
            onPress={handleIniciarParar}
          >
            {!iniciar ? <Play /> : <Square />}
            {!iniciar ? (
              <Text style={styles.textoBotao}>Iniciar</Text>
            ) : (
              <Text style={styles.textoBotao}>Parar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoCronometro}
            onPress={handleReiniciar}
          >
            <RotateCw />
            <Text style={styles.textoBotao}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cronometo}>
        <View style={styles.telaTimer}>
          <Text style={styles.tituloSetter}>Trabalho</Text>
          <TouchableOpacity
            style={[styles.botaoTimer, styles.getButtonStyle(emTrabalho)]}
            onPress={() => handleAlterarTempo('trabalho', 1)}
          >
            <MoveUp color={'white'} />
          </TouchableOpacity>
          <Text style={styles.textoMinutos}>{tempoTrabalho / 60} min</Text>
          <TouchableOpacity
            style={[styles.botaoTimer, styles.getButtonStyle(emTrabalho)]}
            onPress={() => handleAlterarTempo('trabalho', -1)}
          >
            <MoveDown color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={styles.telaTimer}>
          <Text style={styles.tituloSetter}>Descanso</Text>
          <TouchableOpacity
            style={[styles.botaoTimer, styles.getButtonStyle(!emTrabalho)]}
            onPress={() => handleAlterarTempo('descanso', 1)}
          >
            <MoveUp color={'white'} />
          </TouchableOpacity>
          <Text style={styles.textoMinutos}>{tempoDescanso / 60} min</Text>
          <TouchableOpacity
            style={[styles.botaoTimer, styles.getButtonStyle(!emTrabalho)]}
            onPress={() => handleAlterarTempo('descanso', -1)}
          >
            <MoveDown color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f84434',
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
  },
  
  secaoBotoes: {
    flexDirection: 'row',
    marginTop: 20,
  },
  botaoCronometro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#474f4f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  textoBotao: {
    color: 'white',
    marginLeft: 10,
  },
  cronometo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  telaTimer: {
    alignItems: 'center',
  },
  tituloSetter: {
    fontSize: 18,
    marginBottom: 10,
  },
  botaoTimer: {
    backgroundColor: '#f84434',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  textoMinutos: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  getButtonStyle: isActive => {
    return {
      backgroundColor: isActive ? '#f84434' : '#474f4f',
    };
  },
});

export default App;
