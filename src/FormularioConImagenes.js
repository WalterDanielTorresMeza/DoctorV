// src/FormularioConImagenes.js
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
    const canvas = await html2canvas(refFormulario.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p','mm','a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
    pdf.save('reporte-colposcopico.pdf');
  };

  return (
    <div className="form-container">
      <div ref={refFormulario}>

        {/* Encabezado */}
        <h1 className="section-title">REPORTE DE COLPOSCOPIA</h1>

        {/* PACIENTE: fila completa */}
        <div className="form-field" style={{ marginBottom: '16px' }}>
          <label>PACIENTE:</label>
          <input
            type="text"

          />
        </div>

        {/* FECHA DE ESTUDIO / EDAD / FOLIO */}
        <div className="grid-2fr-1fr-1fr">
          <div className="form-field">
            <label>FECHA DE ESTUDIO:</label>
            <input type="text" />
          </div>
          <div className="form-field">
            <label>EDAD:</label>
            <input type="text"  />
          </div>
          <div className="form-field">
            <label>FOLIO:</label>
            <input type="text" />
          </div>
        </div>

        {/* DATOS GINECOLÓGICOS */} 
        <h2 className="section-title">DATOS GINECOLÓGICOS</h2>
        <div className="grid-5cols">
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
            <input type="text" />
          </div>
        </div>

        {/* VAGINA / VULVA */}
        <div className="grid-2cols">
          <div className="form-field">
            <label>VAGINA:</label>
            <input type="text"  />
          </div>
          <div className="form-field">
            <label>VULVA:</label>
            <input type="text"  />
          </div>
        </div>

        {/* EVALUACIÓN GENERAL DE LA COLPOSCOPIA */}
        <h2 className="section-title">EVALUACIÓN GENERAL DE LA COLPOSCOPIA</h2>
        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
        
         
          <label style={{
    fontWeight: 500,
    color: 'var(--text-color)',
    fontSize: '0.95rem',
    marginBottom: '6px',
    display: 'block'    /* igual que .form-field > label */
  }}> ADECUADA:</label>
          <label><input type="checkbox" /> SI</label>
          <label><input type="checkbox" /> NO</label>
        </div>
        <div className="checkbox-group" style={{ marginBottom: '16px' }}>
          <label style={{
    fontWeight: 500,
    color: 'var(--text-color)',
    fontSize: '0.95rem',
    marginBottom: '6px',
    display: 'block'    /* igual que .form-field > label */
  }}>ZONA DE TRANSFORMACIÓN: </label>
          <label><input type="checkbox" /> 1</label>
          <label><input type="checkbox" /> 2</label>
          <label><input type="checkbox" /> 3</label>
        </div>
       
        <div className="checkbox-group" style={{ marginBottom: '24px' }}>
          <label style={{
    fontWeight: 500,
    color: 'var(--text-color)',
    fontSize: '0.95rem',
    marginBottom: '6px',
    display: 'block'    /* igual que .form-field > label */
  }}>UNIÓN ESCAMOCILÍNDRICA:</label>
          <label><input type="checkbox" /> VISIBLE</label>          
          <label><input type="checkbox" /> NO VISIBLE</label>
          <label><input type="checkbox" /> PARCIALMENTE VISIBLE</label>
        </div>

       {/* HALLAZGOS COLPOSCÓPICOS NORMALES */}
<h2 className="section-title">HALLAZGOS COLPOSCÓPICOS NORMALES</h2>

{/* Bloque 1: Escamoso + Deciduosis */}
<div className="grid-2cols" style={{ marginBottom: '16px' }}>
  
<div className="form-field">
  <label>EPITELIO ESCAMOSO ORIGINAL:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      MADURO
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      ATRÓFICO
    </label>
  </div>
</div>
<div className="form-field">
  <label>DECIDUOSIS GESTACIONAL:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>

</div>

{/* Bloque 2 */}
<div className="grid-2cols" style={{ marginBottom: '16px' }}>

  <div className="form-field">
  <label>EPITELIO METAPLÁSICO:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      NORMAL
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      ANORMAL
    </label>
  </div>
</div>

  <div className="form-field">
  <label>ECTOPIA:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
</div>

{/* Bloque 3: Cilíndrico + (vacío si no hay segundo campo) */}
<div className="grid-2cols" style={{ marginBottom: '24px' }}>

    <div className="form-field">
  <label>EPITELIO CILÍNDRICO:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      NORMAL
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      ANORMAL
    </label>
  </div>
</div>


  {/* Si no hay nada a la derecha, déjalo vacío */}
  <div className="form-field"></div>
</div>


        {/* HALLAZGOS COLPOSCÓPICOS ANORMALES */}
        <h2 className="section-title">HALLAZGOS COLPOSCÓPICOS ANORMALES</h2>

<div className="grid-2cols" style={{ marginBottom: '16px' }}>
<div className="form-field">
  <label>LESIÓN:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      GRADO 1
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      GRADO 2
    </label>
  </div>
</div>
<div className="form-field">
  <label>DENTRO DE ZONA DE TRANSFORMACIÓN:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
</div>
        <div className="grid-2cols">

          <div className="form-field">
            <label>RADIO:</label>
            <input type="text" />
          </div>
          <div className="form-field">
            <label>CUADRANTE:</label>
            <input type="text"/>
          </div>
        </div>
        <div className="grid-2cols" style={{ marginBottom: '24px' }}>
          <div className="form-field">
            <label>% SEC:</label>
            <input type="text"  />
          </div>
          <div className="form-field">
            <label>HALLAZGOS INESPECÍFICOS:</label>
            <input type="text"  />
          </div>


<div className="form-field">
  <label>SOSPECHA DE INVASIÓN:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>NECROSIS:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>ULCERACIÓN:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>LESIÓN NODULAR:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>VASOS ATÍPICOS:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
</div>

        {/* HALLAZGOS VARIOS */}
        <h2 className="section-title">HALLAZGOS VARIOS</h2>

<div className="grid-2cols" style={{ marginBottom: '16px' }}>
<div className="form-field">
  <label>ZONA DE TRANSFORMACIÓN CONGENITA:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>PÓLIPOS:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>CONILOMA:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>ESTENOSIS:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>ANOMALÍAS POSTRATAMIENTO:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
<div className="form-field">
  <label>ENDOMETRIOSIS:</label>
  <div className="checkbox-group vertical">
    <label>
      <input type="checkbox" name="maduro" />
      SI
    </label>
    <label>
      <input type="checkbox" name="atrofico" />
      NO
    </label>
  </div>
</div>
</div>

        {/* ÁREA DE IMÁGENES */}
        <h2 className="section-title">IMÁGENES COLPOSCÓPICAS</h2>
        <div className="image-grid">
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

        {/* DIAGNÓSTICO Y COMENTARIOS */}
        <div className="form-field" style={{ marginBottom: '16px' }}>
          <label>DIAGNÓSTICO COLPOSCÓPICO:</label>
          <input type="text" placeholder="Elija un elemento" />
        </div>
        <div className="form-field" style={{ marginBottom: '24px' }}>
          <label>COMENTARIOS Y PLAN DE MANEJO:</label>
          <textarea rows="3" placeholder="Escriba comentarios y plan de manejo" />
        </div>

        {/* Firmas */}
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
      <br/>
      <button className="print-button" onClick={handlePrint}>
        Generar e imprimir PDF
      </button>
    </div>
  );
}
