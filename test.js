var myArray = ["Hallo","Ballo","asdf345","asdf378"];

var Arraystring = myArray.join(",")

var b = Arraystring.split(',')

console.log(myArray)
console.log(Arraystring)
console.log(b)
/*
<tr>
<td>
  <ul>
    <li>Erster Eintrag</li>
    <li>Zweiter Eintrag</li>
    <li>Dritter Eintrag</li>
  </ul>
</td>
<td>
    <ul>
      <li>Erster Eintrag </li>
      <li>Zweiter Eintrag</li>
      <li>Dritter Eintrag</li>
    </ul>
  </td>
  <td>
    <ul>
      <li>Erster Eintrag</li>
      <li>Zweiter Eintrag</li>
      <li>Dritter Eintrag</li>
    </ul>
  </td>
  <td>
    <ul>
      <li>Erster Eintrag</li>
      <li>Zweiter Eintrag</li>
      <li>Dritter Eintrag</li>
    </ul>
  </td>
  <td>
    <ul>
      <% todosFriday=[]; %>
      <script>
      <% todosFriday = localStorage.getItem('todosFriday');%>
      </script>
      <% for(var i =0; i < todosFriday.length; i++) { %>
      <li><%= todosFriday[i] %></li>
      <%} %>
      
    </ul>
  </td>
  <td>
    <ul>
      <li>Erster Eintrag</li>
      <li>Zweiter Eintrag</li>
      <li>Dritter Eintrag</li>
    </ul>
  </td>
  <td>
    <ul>
      <li>Erster Eintrag</li>
      <li>Zweiter Eintrag</li>
      <li>Dritter Eintrag</li>
    </ul>
  </td>
</tr>
*/