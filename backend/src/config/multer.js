const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const sufixoUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, sufixoUnico + path.extname(file.originalname));
  },
});

function filtroFicheiros(req, file, cb) {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp|mp4|mov|webm/;
  const extensaoValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeValido = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
  if (extensaoValida && mimeValido) cb(null, true);
  else cb(new Error('So sao permitidos ficheiros de imagem ou video.'));
}

const upload = multer({ storage, fileFilter: filtroFicheiros, limits: { fileSize: 50 * 1024 * 1024 } });
module.exports = upload;
