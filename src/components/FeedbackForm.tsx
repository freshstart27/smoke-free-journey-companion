import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Star, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storageManager } from '@/utils/storageManager';

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar objeto de feedback
    const feedback = {
      name,
      email,
      feedbackType,
      message,
      rating,
      timestamp: new Date().toISOString()
    };
    
    // Guardar usando o novo sistema de storage
    const existingFeedback = storageManager.getFeedback();
    existingFeedback.push(feedback);
    storageManager.saveFeedback(existingFeedback);
    
    toast({
      title: "Feedback Enviado!",
      description: "Obrigado pela sua opinião. Ela é muito valiosa para nós!",
    });
    
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    setRating(0);
    setFeedbackType('suggestion');
  };

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #D0F0FD' }}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2" style={{ color: '#333333' }}>
            <MessageSquare className="w-6 h-6" style={{ color: '#388E3C' }} />
            Suas Críticas e Sugestões
          </CardTitle>
          <p style={{ color: '#666666' }} className="text-sm">
            Sua opinião é fundamental para melhorarmos o Fresh Start. Compartilhe suas ideias conosco!
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" style={{ color: '#333333' }}>Nome (opcional)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="border-soft-blue"
                />
              </div>
              <div>
                <Label htmlFor="email" style={{ color: '#333333' }}>Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="border-soft-blue"
                />
              </div>
            </div>

            <div>
              <Label style={{ color: '#333333' }}>Tipo de Feedback</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={feedbackType === 'suggestion' ? 'default' : 'outline'}
                  onClick={() => setFeedbackType('suggestion')}
                  className={feedbackType === 'suggestion' ? 'bg-dark-green text-white' : 'border-soft-blue'}
                  size="sm"
                >
                  Sugestão
                </Button>
                <Button
                  type="button"
                  variant={feedbackType === 'criticism' ? 'default' : 'outline'}
                  onClick={() => setFeedbackType('criticism')}
                  className={feedbackType === 'criticism' ? 'bg-dark-green text-white' : 'border-soft-blue'}
                  size="sm"
                >
                  Crítica
                </Button>
                <Button
                  type="button"
                  variant={feedbackType === 'bug' ? 'default' : 'outline'}
                  onClick={() => setFeedbackType('bug')}
                  className={feedbackType === 'bug' ? 'bg-dark-green text-white' : 'border-soft-blue'}
                  size="sm"
                >
                  Bug/Erro
                </Button>
              </div>
            </div>

            <div>
              <Label style={{ color: '#333333' }}>Avaliação Geral</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="message" style={{ color: '#333333' }}>Sua Mensagem *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Compartilhe seus comentários, sugestões ou críticas construtivas..."
                required
                className="min-h-[120px] border-soft-blue"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold py-3"
              style={{ backgroundColor: '#388E3C' }}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Feedback
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#A8E6CF', border: '1px solid #388E3C' }}>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2" style={{ color: '#333333' }}>
            💡 Dicas para um feedback efetivo:
          </h3>
          <ul className="text-sm space-y-1" style={{ color: '#333333' }}>
            <li>• Seja específico sobre o que funcionou bem ou mal</li>
            <li>• Descreva o contexto da sua experiência</li>
            <li>• Sugira melhorias práticas quando possível</li>
            <li>• Seja construtivo e respeitoso</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;
