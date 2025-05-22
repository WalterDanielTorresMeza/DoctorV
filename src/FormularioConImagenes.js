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
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('reporte-colposcopico.pdf');
  };

  return (
    <div style={{ padding: 20, background: '#fff', fontFamily: 'sans-serif' }}>
      {/* === INICIO del área que exportaremos a PDF ==== */}
      <div ref={refFormulario}>

        {/* --- TÍTULO PRINCIPAL --- */}
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>REPORTE COLPOSCÓPICO</h1>

        {/* --- BLOQUE 1: PACIENTE --- */}
        <div style={{ marginBottom: 16 }}>
          <strong>PACIENTE:</strong><br/>
          <input
            type="text"
            name="paciente"
            style={{ width: '100%', padding: 6, fontSize: 14 }}
          />
        </div>

        {/* --- BLOQUE 2: MÉDICO / FECHA / EDAD / FOLIO --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 12,
          marginBottom: 24
        }}>
          <div>
            <strong>MÉDICO A QUIÉN VA DIRIGIDO:</strong><br/>
            <input type="text" name="medico" style={{ width: '100%', padding: 6 }} />
          </div>
          <div>
            <strong>FECHA DE ESTUDIO:</strong><br/>
            <input type="date" name="fecha" style={{ width: '100%', padding: 6 }} />
          </div>
          <div>
            <strong>EDAD:</strong><br/>
            <input type="number" name="edad" style={{ width: '100%', padding: 6 }} />
          </div>
          <div>
            <strong>FOLIO:</strong><br/>
            <input type="text" name="folio" style={{ width: '100%', padding: 6 }} />
          </div>
        </div>

        {/* --- BLOQUE 3: DATOS GINECOLÓGICOS --- */}
        <h2 style={{ marginBottom: 12 }}>Datos Ginecológicos</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          gap: 12,
          marginBottom: 24
        }}>
          {[
            { label: 'Embarazos', name: 'embarazos', type: 'number' },
            { label: 'Partos',    name: 'partos',    type: 'number' },
            { label: 'Abortos',   name: 'abortos',   type: 'number' },
            { label: 'Cesáreas',  name: 'cesareas',  type: 'number' },
            { label: 'FUM',       name: 'fum',       type: 'date'   },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <strong>{label.toUpperCase()}:</strong><br/>
              <input
                type={type}
                name={name}
                style={{ width: '100%', padding: 6 }}
              />
            </div>
          ))}
        </div>

        {/* --- BLOQUE 4: VAGINA / VULVA --- */}
        <h2 style={{ marginBottom: 12 }}>Evaluación General de la Colposcopía</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 24
        }}>
          <div>
            <strong>VAGINA:</strong><br/>
            <select name="vagina" style={{ width: '100%', padding: 6 }}>
              <option>Sin alteraciones aparentes</option>
            </select>
          </div>
          <div>
            <strong>VULVA:</strong><br/>
            <select name="vulva" style={{ width: '100%', padding: 6 }}>
              <option>Sin alteraciones aparentes</option>
            </select>
          </div>
        </div>

        {/* --- BLOQUE 5: CHECKS --- */}
        <div style={{ marginBottom: 24 }}>
          <strong>CALIFICACIÓN:</strong><br/>
          {[1,2,3].map(n => (
            <label key={n} style={{ marginRight: 16 }}>
              <input type="checkbox" name={`colpo${n}`} /> {n}
            </label>
          ))}
        </div>

        {/* --- BLOQUE 6: 4 IMÁGENES --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          marginBottom: 24
        }}>
          {imagenes.map((src, i) => (
            <div key={i} style={{
              position: 'relative',
              width: '100%',
              paddingTop: '75%',
              border: '1px solid #666',
              background: '#f7f7f7',
              overflow: 'hidden'
            }}>
              {src ? (
                <img
                  src={src}
                  alt={`Imagen ${i+1}`}
                  style={{
                    position: 'absolute',
                    top:0, left:0,
                    width:'100%', height:'100%',
                    objectFit:'cover'
                  }}
                />
              ) : (
                <label style={{
                  position: 'absolute',
                  inset: 0,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#888',
                  cursor:'pointer'
                }}>
                  + Cargar imagen
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display:'none' }}
                    onChange={e => handleImageChange(i, e)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* --- BLOQUE 7: FIRMAS --- */}
        <div style={{
          display:'flex',
          justifyContent:'space-between'
        }}>
          <div style={{ width:'48%', textAlign:'center', borderTop:'1px solid #666', paddingTop:4 }}>
            MÉDICO QUE REALIZA<br/>FIRMA
          </div>
          <div style={{ width:'48%', textAlign:'center', borderTop:'1px solid #666', paddingTop:4 }}>
            MÉDICO REVISOR<br/>FIRMA
          </div>
        </div>
      </div>
      {/* === FIN del área que exportamos a PDF ==== */}

      {/* --- BOTÓN DE IMPRESIÓN --- */}
      <button
        onClick={handlePrint}
        style={{
          marginTop: 24,
          padding: '8px 16px',
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        Generar e imprimir PDF
      </button>
    </div>
  );
}
