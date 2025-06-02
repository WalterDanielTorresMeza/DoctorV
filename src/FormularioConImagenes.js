import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './FormularioConImagenes.css';

export default function FormularioConImagenes() {
  const refFormulario = useRef();
  const [imagenes, setImagenes] = useState([null, null, null, null]);

  const handleImageChange = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const copia = [...imagenes];
      copia[idx] = reader.result;
      setImagenes(copia);
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = async () => {
    // 1) Capturamos todo el “inner-form-container” como un canvas de alta resolución
    const canvas = await html2canvas(refFormulario.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // 2) Creamos un PDF tamaño A4 vertical
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 3) Obtenemos las dimensiones originales de la imagen capturada
    const imgProps = pdf.getImageProperties(imgData);
    const imgWpx   = imgProps.width;
    const imgHpx   = imgProps.height;

    // 4) Calculamos la altura que ocupará la imagen al ajustarla al ancho A4
    const pdfImgHeight = (imgHpx * pdfWidth) / imgWpx;

    // 5) Dibujamos la primera página
    let positionY = 0;
    pdf.addImage(
      imgData,
      'PNG',
      0,
      positionY,
      pdfWidth,
      pdfImgHeight
    );

    // 6) Calculamos cuánto sobrepasa la altura de una página
    let heightLeft = pdfImgHeight - pdfHeight;

    // 7) Mientras quede contenido que no cupo en la primera página, generamos más páginas
    while (heightLeft > 0) {
      positionY -= pdfHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        0,
        positionY,
        pdfWidth,
        pdfImgHeight
      );
      heightLeft -= pdfHeight;
    }

    // 8) Guardamos el PDF resultante
    pdf.save('reporte-colposcopico.pdf');
  };

  // Estilo “en línea” para las etiquetas de pregunta (para evitar tocar demasiado el CSS)
  const preguntaStyle = {
    fontWeight: 500,
    color: 'var(--text-color)',
    fontSize: '0.95rem',
    marginBottom: '6px',
    display: 'block'
  };

  return (
    <div className="form-container">
      {/* ───────────────────────────────────────────── */}
      {/*   Ícono (logo) ahora DENTRO del contenedor   */}
      {/* ───────────────────────────────────────────── */}
      <div ref={refFormulario} className="inner-form-container">
        <img
          src="/iv.png"
          alt="Instituto Vida"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 140,  // o el tamaño que consideres adecuado
            height: 'auto'
          }}
        />

        {/* ============================== */}
        {/*    ENCABEZADO DEL FORMULARIO   */}
        {/* ============================== */}
        <h1 className="section-title">REPORTE DE COLPOSCOPIA</h1>

        {/* PACIENTE: fila completa */}
        <div className="form-field" style={{ marginBottom: '16px' }}>
          <label>PACIENTE:</label>
          <input
            type="text"
            placeholder="Escriba nombre completo"
          />
        </div>

        {/* FECHA DE ESTUDIO / EDAD / FOLIO */}
        <div className="grid-2fr-1fr-1fr" style={{ marginBottom: '24px' }}>
          <div className="form-field">
            <label>FECHA DE ESTUDIO:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
          <div className="form-field">
            <label>EDAD:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
          <div className="form-field">
            <label>FOLIO:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
        </div>

        {/* ============================== */}
        {/*    DATOS GINECOLÓGICOS         */}
        {/* ============================== */}
        <h2 className="section-title">DATOS GINECOLÓGICOS</h2>

        {/* ← Aquí volvemos a “grid-5cols” para que cada input sea más angosto */}
        <div className="grid-5cols" style={{ marginBottom: '24px' }}>
          <div className="form-field">
            <label>EMBARAZOS:</label>
            <input type="number" />
          </div>
          <div className="form-field">
            <label>PARTOS:</label>
            <input type="number" />
          </div>
          <div className="form-field">
            <label>CESÁREAS:</label>
            <input type="number" />
          </div>
          <div className="form-field">
            <label>ABORTOS:</label>
            <input type="number" />
          </div>
          <div className="form-field">
            <label>FUM:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
        </div>

        {/* VAGINA / VULVA */}
        <div className="grid-2cols" style={{ marginBottom: '24px' }}>
          <div className="form-field">
            <label>VAGINA:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
          <div className="form-field">
            <label>VULVA:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
        </div>

        {/* ================================================ */}
        {/*    EVALUACIÓN GENERAL DE LA COLPOSCOPIA          */}
        {/* ================================================ */}
        <h2 className="section-title">EVALUACIÓN GENERAL DE LA COLPOSCOPIA</h2>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>ADECUADA:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>ZONA DE TRANSFORMACIÓN:</label>
          <label><input type="checkbox" /> 1</label>
          <label><input type="checkbox" /> 2</label>
          <label><input type="checkbox" /> 3</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '24px' }}>
          <label style={preguntaStyle}>UNIÓN ESCAMOCILÍNDRICA:</label>
          <label><input type="checkbox" /> VISIBLE</label>
          <label><input type="checkbox" /> NO VISIBLE</label>
          <label><input type="checkbox" /> PARCIALMENTE VISIBLE</label>
        </div>

        {/* ================================================ */}
        {/*    HALLAZGOS COLPOSCÓPICOS NORMALES             */}
        {/* ================================================ */}
        <h2 className="section-title">HALLAZGOS COLPOSCÓPICOS NORMALES</h2>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>EPITELIO ESCAMOSO ORIGINAL:</label>
          <label><input type="checkbox" /> MADURO</label>
          <label><input type="checkbox" /> ATRÓFICO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>DECIDUOSIS GESTACIONAL:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>EPITELIO METAPLÁSICO:</label>
          <label><input type="checkbox" /> NORMAL</label>
          <label><input type="checkbox" /> ANORMAL</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>ECTOPIA:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '24px' }}>
          <label style={preguntaStyle}>EPITELIO CILÍNDRICO:</label>
          <label><input type="checkbox" /> NORMAL</label>
          <label><input type="checkbox" /> ANORMAL</label>
        </div>

        {/* ================================================ */}
        {/*    HALLAZGOS COLPOSCÓPICOS ANORMALES             */}
        {/* ================================================ */}
        <h2 className="section-title">HALLAZGOS COLPOSCÓPICOS ANORMALES</h2>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>LESIÓN:</label>
          <label><input type="checkbox" /> GRADO 1</label>
          <label><input type="checkbox" /> GRADO 2</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>DENTRO DE ZONA DE TRANSFORMACIÓN:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="grid-2cols" style={{ marginBottom: '16px' }}>
          <div className="form-field">
            <label>RADIO:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
          <div className="form-field">
            <label>CUADRANTE:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
        </div>

        <div className="grid-2cols" style={{ marginBottom: '24px' }}>
          <div className="form-field">
            <label>% SEC:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
          <div className="form-field">
            <label>HALLAZGOS INESPECÍFICOS:</label>
            <input type="text" placeholder="Escriba nombre completo" />
          </div>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>SOSPECHA DE INVASIÓN:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>NECROSIS:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>ULCERACIÓN:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={preguntaStyle}>LESIÓN NODULAR:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        <div className="checkbox-group" style={{ marginBottom: '24px' }}>
          <label style={preguntaStyle}>VASOS ATÍPICOS:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>

        {/* ================================================ */}
        {/*    HALLAZGOS VARIOS                              */}
        {/* ================================================ */}
        <div className="hallazgos-varios-block">
          <h2 className="section-title">HALLAZGOS VARIOS</h2>

          <div className="checkbox-group" style={{ marginBottom: '16px' }}>
            <label style={preguntaStyle}>ZONA DE TRANSFORMACIÓN CONGÉNITA:</label>
            <label><input type="checkbox" /> SI</label>
            <label><input type="checkbox" /> NO</label>
          </div>

          <div className="checkbox-group" style={{ marginBottom: '16px' }}>
            <label style={preguntaStyle}>PÓLIPOS:</label>
            <label><input type="checkbox" /> SI</label>
            <label><input type="checkbox" /> NO</label>
          </div>

          <div className="checkbox-group" style={{ marginBottom: '16px' }}>
            <label style={preguntaStyle}>CONDILOMA:</label>
            <label><input type="checkbox" /> SI</label>
            <label><input type="checkbox" /> NO</label>
          </div>

          <div className="checkbox-group" style={{ marginBottom: '16px' }}>
            <label style={preguntaStyle}>ESTENOSIS:</label>
            <label><input type="checkbox" /> SI</label>
            <label><input type="checkbox" /> NO</label>
          </div>

          <div className="checkbox-group" style={{ marginBottom: '16px' }}>
            <label style={preguntaStyle}>ANOMALÍAS POSTRATAMIENTO:</label>
            <label><input type="checkbox" /> SI</label>
            <label><input type="checkbox" /> NO</label>
          </div>

          <div className="checkbox-group" style={{ marginBottom: '24px' }}>
            <label style={preguntaStyle}>ENDOMETRIOSIS:</label>
            <label><input type="checkbox" /> SI</label>
            <label><input type="checkbox" /> NO</label>
          </div>
        </div>

        {/* ================================================ */}
        {/*    ÁREA DE IMÁGENES                              */}
        {/* ================================================ */}
        <h2 className="section-title">IMÁGENES COLPOSCÓPICAS</h2>
        <div className="image-grid" style={{ marginBottom: '24px' }}>
          {imagenes.map((src, i) => (
            <div className="image-slot" key={i}>
              {src ? (
                <img src={src} alt={`Colposcópica ${i+1}`} />
              ) : (
                <label>
                  + Cargar imagen
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(i, e)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* ================================================ */}
        {/*    DIAGNÓSTICO Y PLAN DE MANEJO                   */}
        {/* ================================================ */}
        <div className="form-field" style={{ marginBottom: '16px' }}>
          <label>DIAGNÓSTICO COLPOSCÓPICO:</label>
          <input type="text" placeholder="Elija un elemento" />
        </div>
        <div className="form-field" style={{ marginBottom: '24px' }}>
          <label>COMENTARIOS Y PLAN DE MANEJO:</label>
          <textarea rows="3" placeholder="Escriba comentarios y plan de manejo" />
        </div>

        {/* ============================== */}
        {/*    FIRMAS                     */}
        {/* ============================== */}
        <div className="signatures">
          <div className="signature-box">
            ____________________________________________<br/>
            DR LUIS ANGEL HURTADO ALVAREZ<br/>
            GINECOLOGÍA Y OBSTETRICIA / REPRODUCCIÓN ASISTIDA<br/>
            COLPOSCOPIA Y PATOLOGÍA VULVOVAGINAL<br/>
            CP 11399310 / C.ESP. 13311567
          </div>
        </div>
      </div>

      {/* Botón de impresión */}
      <button className="print-button" onClick={handlePrint}>
        Generar e imprimir PDF
      </button>
    </div>
  );
}
