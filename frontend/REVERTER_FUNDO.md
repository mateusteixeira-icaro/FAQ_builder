# Como Reverter a Imagem de Fundo

Para reverter rapidamente as mudanças da imagem de fundo, siga estes passos:

## 1. Restaurar o arquivo App.css original
```bash
cp src/App.css.backup src/App.css
```

## 2. Remover a imagem (opcional)
```bash
rm src/assets/datacenter-bg.svg
rmdir src/assets  # se a pasta ficar vazia
```

## 3. Remover os arquivos de backup (opcional)
```bash
rm src/App.css.backup
rm src/index.css.backup
```

## Arquivos modificados:
- `src/App.css` - Adicionada imagem de fundo com overlay
- `src/assets/datacenter-bg.svg` - Imagem SVG do data center

## Arquivos de backup criados:
- `src/App.css.backup` - Backup do CSS original
- `src/index.css.backup` - Backup do CSS original (não modificado)

## Mudanças aplicadas:
- Imagem de fundo do data center com efeito futurista
- Overlay semi-transparente branco (85% opacidade) para manter legibilidade
- Blur sutil (1px) para suavizar o fundo
- Background fixo que não rola com o conteúdo