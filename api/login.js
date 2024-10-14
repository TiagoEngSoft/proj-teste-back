export default function handler(req, res) {
    if (req.method === 'POST') {
      // Exemplo de lógica de login
      const { username, password } = req.body;
  
      // Validação simples de credenciais (apenas um exemplo, não use em produção)
      if (username === 'admin' && password === '1234') {
        res.status(200).json({ message: 'Login bem-sucedido' });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } else {
      res.status(405).json({ message: 'Método não permitido' });
    }
  }
  