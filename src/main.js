import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import PlayerLookupService from './services/player-lookup-service.js';
import PlayerStatsService from './services/player-stats-service';

function clearFields() {
  $('#playerName').val("");
  $('.show-errors').text("");
}

function displayPlayerCard(player) {
  console.log(player)
  $('.playerId-show').html(
    `<p>${player.name_first} ${player.name_last} 
    <p> id number: ${player.player_id} birthplace: ${player.birth_country}</p>
    <p>bats: ${player.bats}</p>
    <p>position: ${player.position}</p>
    `);
}

function displayStats(response) {
  console.log(response);
  const battingAverage = response.sport_hitting_tm.queryResults.row.avg;
  const rbi = response.sport_hitting_tm.queryResults.row.rbi;
  $('.show-batting-average').html(`<table>
  <tr>
  <td>Season</td>
    <td>Batting Average (AVG)</td>
    <td>Runs Batted In (RBI)</td>
    </tr>
    <tr>
    <td>2017</td>
    <td>${battingAverage}</td>
    <td>${rbi}</td>
    </tr>
    </table>
   
    `);
}

function displayErrors(error) {
  $('.show-errors').text(`${error}`);
}

$(document).ready(function () {
  $('#playerName').click(function () {
    let input = $('#playerNameInput').val();
    clearFields();
    PlayerLookupService.getPlayerCard(input)
      .then(function (playerLookupResponse) {
        if (playerLookupResponse instanceof Error) {
          throw Error(`Player Name error: ${playerLookupResponse.message}`);
        }
        const playerId = playerLookupResponse.search_player_all.queryResults.row.player_id;
        const player = playerLookupResponse.search_player_all.queryResults.row
        displayPlayerCard(player);
        return PlayerStatsService.getStats(playerId);
      })
      .then(function (statsResponse) {
        if (statsResponse instanceof Error) {
          throw Error(`stats API error: ${statsResponse.message}`);
        }
        displayStats(statsResponse);
      })
      .catch(function (error) {
        displayErrors(error.message);
      });
  });
});


